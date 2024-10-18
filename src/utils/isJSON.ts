export const isJSON = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
};
