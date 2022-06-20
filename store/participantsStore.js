const participants = []

const addConversationParticipant = (conversationID, userID) => {
  participants.push({
    conversationID,
    userID
  })
}

const getAllParticipantsByConversationID = conversationID => {
  return participants.filter(participant => participant.conversationID === conversationID)
}

const getAllParticipantsByUserID = userID => {
  return participants.filter(participant => participant.userID === userID)
}

module.exports = {
  addConversationParticipant,
  getAllParticipantsByConversationID,
  getAllParticipantsByUserID
}