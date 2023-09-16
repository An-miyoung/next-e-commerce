export const filterFormikErrors = <T extends Object>(
  touched: { [key: string]: boolean },
  errors: T,
  values: T
) => {
  const touchedKeys = Object.entries(touched).map(([key, value]) => key);

  const formErrors: string[] = [];
  Object.entries(errors).forEach(([key, value]) => {
    if (touchedKeys.includes(key) && value) formErrors.push(value);
  });

  return formErrors;
};
