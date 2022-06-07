# side bar
  will have a general chat first at all times
  there will be a container with title Rooms above it
  there will be a container with title Online Users below it
  only users will be displayed and be clickable to start a chat.
  new messages will be the chat box appear first.

  search box will be added above the side bar


# client side messages state
  messages = useState({})
  onMessage = setState(currMessages => {...currMessages, 'message.receiver': currMessages[message.receiver].push(message)})