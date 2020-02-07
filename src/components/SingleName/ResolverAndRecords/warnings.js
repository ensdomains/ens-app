export const getOldContentWarning = (type, contentType) => {
  if (type === 'content' && contentType === 'oldcontent') {
    return 'You should update the resolver before entering content.'
  }
}
