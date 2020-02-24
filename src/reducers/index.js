const avatar = (state = [], action) => {
  switch (action.type) {
    case 'CHANGE_AVATAR':
      return {
        avatar: action.avatar,
      }
    default:
      return state
  }
}

export default avatar;
