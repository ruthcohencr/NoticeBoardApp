export function extractErrors(err: any): string[] {
    let errors: string[] = [];

    if (err.status === 400 && err.error) {
      // Extract the description field from the error response
      errors = err.error.map((e: any) => e.description || 'Unknown error');
    } else if (err.error?.message) {
      // Fallback for other types of errors
      errors.push(err.error.message);
    } else {
      // General fallback error message
      errors.push('An unknown error occurred.');
    }

    return errors;
  }