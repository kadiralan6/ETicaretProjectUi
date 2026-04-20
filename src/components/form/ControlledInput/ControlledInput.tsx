"use client";

import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Box, Input, Text } from "@chakra-ui/react";

interface ControlledInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
}

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
}: ControlledInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <Text mb="8px" fontWeight="bold" fontSize="sm">
            {label}
          </Text>
          <Input
            {...field}
            type={type}
            placeholder={placeholder || label}
            borderColor={error ? "red.500" : undefined}
            _focus={{
              borderColor: error ? "red.500" : "teal.500",
              boxShadow: error ? "0 0 0 1px red" : "0 0 0 1px teal",
            }}
          />
          {error && (
            <Text color="red.500" fontSize="xs" mt="4px">
              {error.message}
            </Text>
          )}
        </Box>
      )}
    />
  );
};
