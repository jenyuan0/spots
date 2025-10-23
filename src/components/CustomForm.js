'use client';
import React, { useState } from 'react';
import { hasArrayValue, toCamelCase } from '@/lib/helpers';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/store/hook';
import { setProgressStatus } from '@/store/global/progressLoaderSlice';
import {
	Form,
	FormControl,
	FormFieldController,
	FormField,
	FormLabel,
	FormMessage,
} from '@/components/Form';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';
import Button from '@/components/Button';

const VALIDATION_PATTERNS = {
	email: {
		value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
		message: 'Please enter a valid email address',
	},
	phone: {
		value:
			/^(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})$/,
		message: 'Please enter a valid phone number',
	},
};

const FORM_STATES = {
	IDLE: 'idle',
	SUBMITTING: 'submitting',
	SUCCESS: 'success',
	ERROR: 'error',
};

const getFieldRules = ({ required, inputType, minLength }) => {
	const rules = {
		required: required && 'This field is required',
	};

	if (inputType === 'email') {
		rules.pattern = VALIDATION_PATTERNS.email;
	} else if (inputType === 'tel') {
		rules.pattern = VALIDATION_PATTERNS.phone;
	}

	if (minLength) {
		rules.minLength = {
			value: minLength,
			message: `Must be at least ${minLength} characters`,
		};
	}

	return rules;
};

const FormItem = ({ item, control, selectOption }) => {
	const {
		inputType,
		fieldLabel,
		size,
		placeholder,
		selectOptions,
		name,
		value,
		rules,
	} = item;
	const renderFormComponent = (field) => {
		switch (inputType) {
			case 'textarea':
				return <Textarea {...field} placeholder={placeholder} />;
			case 'select':
				return (
					<Select
						{...field}
						options={selectOptions}
						placeholder={placeholder}
						selectOption={selectOption}
					/>
				);
			default:
				return <Input {...field} type={inputType} placeholder={placeholder} />;
		}
	};

	return (
		<FormFieldController
			control={control}
			name={name}
			rules={rules}
			defaultValue={value}
			render={({ field }) => (
				<FormField
					size={size}
					style={inputType === 'hidden' ? { display: 'none' } : undefined}
				>
					<FormLabel>
						{fieldLabel} <FormMessage />
					</FormLabel>
					<FormControl>{renderFormComponent(field)}</FormControl>
				</FormField>
			)}
		/>
	);
};

export default function CustomForm({ data, hiddenFields }) {
	const {
		formFields,
		successMessage,
		errorMessage,
		sendToEmail,
		emailSubject,
		formFailureNotificationEmail,
		localization,
	} = data || {};

	const { sending, sendMessage, averageResponseTime, selectOption } =
		localization || {};
	const [formState, setFormState] = useState(FORM_STATES.IDLE);
	const dispatch = useAppDispatch();
	const formFieldsData = (formFields || []).map((item) => {
		return {
			...item,
			name: toCamelCase(item.fieldLabel),
			rules: getFieldRules(item),
		};
	});

	const defaultValues = formFieldsData.reduce((acc, { name, inputType }) => {
		acc[name] = '';
		return acc;
	}, {});

	const form = useForm({
		defaultValues,
		mode: 'onSubmit',
	});

	const onHandleSubmit = async (formData) => {
		dispatch(setProgressStatus('start'));
		setFormState(FORM_STATES.SUBMITTING);

		const bodyData = {
			sendToEmail: sendToEmail,
			emailSubject: emailSubject,
			formData: formData,
		};

		try {
			const response = await fetch('/api/submit-form', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(bodyData),
			});

			if (!response.ok) {
				sendErrorNotificationEmail({
					emailTo: formFailureNotificationEmail,
					bodyData: bodyData,
					errorInfo: response.text(),
				});
				setFormState(FORM_STATES.ERROR);
				throw new Error(await response.text());
			}

			setFormState(FORM_STATES.SUCCESS);
		} catch (error) {
			console.error('Form submission error:', error);
			setFormState(FORM_STATES.ERROR);
			sendErrorNotificationEmail({
				emailTo: formFailureNotificationEmail,
				formData,
				errorInfo: error,
			});
		} finally {
			setTimeout(() => {
				dispatch(setProgressStatus('complete'));
				if (formState == FORM_STATES.SUCCESS) form.reset();
			}, 1000);
		}
	};

	if (!hasArrayValue(formFields)) return null;

	return (
		<div className="c-form">
			<Form {...form}>
				<form
					className="c-form__fields"
					onSubmit={form.handleSubmit(onHandleSubmit)}
				>
					{hiddenFields?.map((item, index) => (
						<FormItem
							key={`hidden-field-${index}`}
							item={item}
							control={form.control}
						/>
					))}
					{formFieldsData.map((item) => (
						<FormItem
							key={item._key}
							item={item}
							control={form.control}
							selectOption={selectOption}
						/>
					))}
					{formState === FORM_STATES.SUCCESS ? (
						<p className="c-form__message t-l-1">
							<br />
							{successMessage || 'Success. Your message has been sent.'}
							<br />
						</p>
					) : (
						<Button
							type="submit"
							disabled={formState === FORM_STATES.SUBMITTING}
							className="c-form__cta btn cr-green-d"
						>
							{formState === FORM_STATES.SUBMITTING
								? `${sending || 'Sending...'}`
								: `${sendMessage || 'Send Message'}`}
						</Button>
					)}
				</form>
				{formState !== FORM_STATES.ERROR && (
					<div className="c-form__message t-b-2 cr-subtle-5">
						{averageResponseTime || 'Average response time < 8hr'}
					</div>
				)}
				{formState === FORM_STATES.ERROR && (
					<p className="c-form__message t-b-2">
						{errorMessage ||
							'Error. There was an issue submitting your message. Please try again later.'}
					</p>
				)}
			</Form>
		</div>
	);
}

/**
 * Sends an error notification email with form data and error information.
 * Attempts multiple backup email endpoints if primary fails.
 * @param {string} params.emailTo - Recipient email address
 * @param {Object} params.formData - Form data to include in email
 * @param {string} params.errorInfo - Error information to include in email
 * @returns {Promise<{success: boolean, attempts: number, lastError?: Error}>}
 */

async function sendErrorNotificationEmail({ emailTo, bodyData, errorInfo }) {
	const { sendToEmail, emailSubject, formData } = bodyData;
	const emailData = {
		email: emailTo,
		emailSubject: emailSubject,
		emailHtmlContent: `
			<p>
				Your form failed to send. Please notify your website administrator. A backup is provided below.
			</p>
			<p>
				<strong>Error Details: </strong><br>
				Page URL: ${window.location.href}<br>
				Timestamp: ${new Date().toISOString()}<br>
				${formatObjectToHtml(errorInfo)}
			</p>
      <p>
				<strong>Form Data: </strong><br>
				Send to: ${sendToEmail}<br>
				Subject: ${emailSubject}<br>
				${formatObjectToHtml(formData)}
			</p>`,
	};

	async function sendEmail({ apiUrl, emailData }) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(emailData),
				signal: controller.signal,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`HTTP error! status: ${response.status}, body: ${errorText}`
				);
			}

			return true;
		} catch (error) {
			console.error(`Email sending failed for ${apiUrl}:`, error);
			return false;
		} finally {
			clearTimeout(timeout);
		}
	}

	const emailApiUrls = [
		'/api/send-notification-email',
		'/api/send-backup-email',
		'/api/send-backup-email?useTransporter2=true',
	];

	let attempts = 0;
	let lastError = null;

	for (const apiUrl of emailApiUrls) {
		attempts++;

		try {
			const success = await sendEmail({ apiUrl, emailData });
			if (success) {
				return { success: true, attempts };
			}
		} catch (error) {
			lastError = error;
			console.error(`Attempt ${attempts} failed:`, error);
		}

		// Add delay between retries
		if (attempts < emailApiUrls.length) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	return {
		success: false,
		attempts,
		lastError,
	};
}
