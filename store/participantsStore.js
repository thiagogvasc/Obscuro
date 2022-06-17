const participants = []

const getAllParticipantsFromConversation = conversationID => {
  participants.filter(participant => participant.conversationID === conversationID)
}

const getAllConversationsFromParticipant = userID => {
  participants.filter(participant => participant.userID === userID)
}

module.exports = {
  getAllParticipantsFromConversation, 
  getAllConversationsFromParticipant
}