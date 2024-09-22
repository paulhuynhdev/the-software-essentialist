function parseUserForResponse(user: unknown) {
  const returnData = JSON.parse(JSON.stringify(user));
  delete returnData.password;
  return returnData;
}

export { parseUserForResponse };
