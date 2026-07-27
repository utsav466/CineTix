export function appendFormValue(
  formData: FormData,
  key: string,
  value: unknown,
): void {
  if (
    value === undefined ||
    value === null
  ) {
    return;
  }

  if (
    typeof File !==
      "undefined" &&
    value instanceof File
  ) {
    formData.append(
      key,
      value,
    );

    return;
  }

  if (
    Array.isArray(value)
  ) {
    formData.append(
      key,
      JSON.stringify(value),
    );

    return;
  }

  formData.append(
    key,
    String(value),
  );
}