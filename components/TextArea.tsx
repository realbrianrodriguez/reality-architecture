import { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function TextArea({ className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      className={`glass-input w-full text-base resize-vertical min-h-[160px] ${className}`}
      {...props}
    />
  );
}
