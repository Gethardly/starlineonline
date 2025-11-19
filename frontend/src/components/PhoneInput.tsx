import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ className, placeholder, value = "", onChange, ...props }, ref) => {
        const formatPhoneNumber = (input: string): string => {
            const digits = input.replace(/\D/g, "");

            let phoneDigits = digits;
            if (digits.startsWith("996")) {
                phoneDigits = digits.slice(0, 12);
            } else {
                phoneDigits = "996" + digits.slice(0, 9);
            }

            const parts = [phoneDigits.slice(0, 3)];
            if (phoneDigits.length > 3) parts.push(phoneDigits.slice(3, 6));
            if (phoneDigits.length > 6) parts.push(phoneDigits.slice(6, 8));
            if (phoneDigits.length > 8) parts.push(phoneDigits.slice(8, 10));
            if (phoneDigits.length > 10) parts.push(phoneDigits.slice(10, 12));

            return "+" + parts.join(" ");
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target.value;

            if (input.length < 4) {
                onChange?.("+996 ");
                return;
            }

            const formatted = formatPhoneNumber(input);
            onChange?.(formatted);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            if (!value || value === "") {
                onChange?.("+996 ");
            }
            props.onFocus?.(e);
        };

        const displayValue = value || "+996 ";

        return (
            <Input
                ref={ref}
                type="tel"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder={placeholder || "+996 ___ __ __ __"}
                className={cn("font-mono", className)}
                {...props}
            />
        );
    }
);

PhoneInput.displayName = "PhoneInput";