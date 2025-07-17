import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeAnim } from '@/lib/animate';
import { hasArrayValue, slugify } from '@/lib/helpers';
import clsx from 'clsx';

const FieldTypes = {
	SELECT: 'select',
	TEXTAREA: 'textarea',
	CHECKBOX: 'checkbox',
};

const Label = ({ isHideLabel, id, children }) => (
	<label
		className={clsx({
			'screen-reader-only': isHideLabel,
		})}
		htmlFor={id}
	>
		{children}
	</label>
);

export default function Field({
	name,
	type = 'text',
	label,
	placeholder,
	className,
	hasValue,
	errors,
	isHideLabel,
	isFloatingLabel,
	disabled,
	register,
	rules,
	selectOptions,
	value,
	onChange,
	...props
}) {
	const id = useId();
	const isLabelAtTop = !isFloatingLabel && type !== FieldTypes.CHECKBOX;

	const renderField = () => {
		switch (type) {
			case FieldTypes.SELECT:
				return (
					<select
						name={name}
						id={id}
						className={clsx({
							'is-contain-value': hasValue,
						})}
						disabled={disabled}
						{...(register ? register(name) : {})}
					>
						{hasArrayValue(selectOptions) &&
							selectOptions.map(({ _key, option }) => (
								<option key={_key} value={slugify(option)}>
									{option}
								</option>
							))}
					</select>
				);
			case FieldTypes.TEXTAREA:
				return (
					<textarea
						name={name}
						id={id}
						className={clsx({
							'is-contain-value': hasValue,
						})}
						placeholder={placeholder}
						disabled={disabled}
						value={value}
						onChange={(e) => onChange?.(e)}
						{...(register ? register(name, rules) : {})}
					/>
				);
			case FieldTypes.CHECKBOX:
				return (
					<input
						type="checkbox"
						name={name}
						id={id}
						disabled={disabled}
						{...(register ? register(name) : {})}
					/>
				);
			default:
				return (
					<input
						type={type}
						name={name}
						id={id}
						className={clsx({
							'is-contain-value': hasValue,
						})}
						placeholder={placeholder}
						disabled={disabled}
						readOnly={props.readOnly}
						onClick={props.onClick}
						value={value}
						onChange={(e) => onChange?.(e)}
						{...(register ? register(name, rules) : {})}
					/>
				);
		}
	};

	return (
		<div
			className={clsx('c-field', className, {
				'is-error': errors && errors[name],
				'is-floating-label': !isLabelAtTop,
			})}
			{...props}
		>
			{isLabelAtTop && (
				<Label isHideLabel={isHideLabel} id={id} name={name}>
					{label}
					<AnimatePresence>
						{errors?.[name] && (
							<motion.p
								initial="hide"
								animate="show"
								exit="hide"
								variants={fadeAnim}
								className="error-message"
							>
								{errors[name].message || 'Required field'}
							</motion.p>
						)}
					</AnimatePresence>
				</Label>
			)}
			{renderField()}
			{!isLabelAtTop && (
				<Label isHideLabel={isHideLabel} id={id} label={label} name={name} />
			)}
		</div>
	);
}
