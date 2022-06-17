const sessions = {}

const findSession = sessionID => {
  return sessions[sessionID]
}

module.exports = { findSession , sessions}