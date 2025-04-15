'use client';
import clsx from 'clsx';
import React, { useId, createContext, useContext, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';

const Form = FormProvider;

const FormFieldControllerContext = createContext({});
const FormFieldController = ({ ...props }) => {
	return (
		<FormFieldControllerContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldControllerContext.Provider>
	);
};

const FormFieldContext = createContext({});

const useFormField = () => {
	const fieldControllerContext = useContext(FormFieldControllerContext);
	const fieldContext = useContext(FormFieldContext);
	const { getFieldState, formState } = useFormContext();
	const fieldState = getFieldState(fieldControllerContext.name, formState);

	if (!fieldControllerContext) {
		throw new Error('useFormField should be used within <FormFieldController>');
	}

	const { id } = fieldContext;

	return {
		id,
		name: fieldControllerContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
};

const FormField = forwardRef(({ className, size, ...props }, ref) => {
	const id = useId();
	const { error } = useFormField();
	return (
		<FormFieldContext.Provider value={{ id }}>
			<div
				ref={ref}
				className={clsx('field', className, {
					'is-error': error,
				})}
				data-size={size}
				{...props}
			/>
		</FormFieldContext.Provider>
	);
});

FormField.displayName = 'FormField';

const FormLabel = forwardRef(({ className, htmlFor, ...props }, ref) => {
	const { formItemId } = useFormField();

	return (
		<label
			ref={ref}
			htmlFor={htmlFor || formItemId}
			className={className}
			{...props}
		/>
	);
});

FormLabel.displayName = 'FormLabel';

const FormControl = forwardRef(({ ...props }, ref) => {
	const { error, formItemId, formDescriptionId, formMessageId } =
		useFormField();

	return (
		<Slot
			ref={ref}
			id={formItemId}
			aria-describedby={
				!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props}
		/>
	);
});

FormControl.displayName = 'FormControl';

const FormDescription = forwardRef(({ className, ...props }, ref) => {
	const { formDescriptionId } = useFormField();

	return (
		<p ref={ref} id={formDescriptionId} className={className} {...props} />
	);
});

FormDescription.displayName = 'FormDescription';

const FormMessage = forwardRef(
	({ className, children, htmlTag, ...props }, ref) => {
		const { name, error, formMessageId } = useFormField();

		const body =
			error?.type === 'required'
				? `Required field`
				: error?.message
					? String(error?.message)
					: children;

		if (!body) {
			return null;
		}
		const Comp = htmlTag ?? 'p';
		return (
			<Comp
				ref={ref}
				id={formMessageId}
				className={clsx(className, {
					'error-message': error,
				})}
				{...props}
			>
				{body}
			</Comp>
		);
	}
);

FormMessage.displayName = 'FormMessage';

export {
	useFormField,
	Form,
	FormField,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	FormFieldController,
};
