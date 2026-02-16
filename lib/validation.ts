
export const validateTitle = (title: string): string | null => {
  if (title.length > 50) return "Name cannot exceed 50 characters";
  if (title.length > 0 && title.trim().length < 3) return "Name must be at least 3 characters";
  if (/[<>]/.test(title)) return "Name cannot contain special characters like < or >";
  return null;
};
