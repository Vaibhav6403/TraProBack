const User = require('../models/User')
const WebSocket = require('ws');
const Trip = require('../models/Trip');
const Message = require("../models/Message")

exports.handleMessage = async (ws,data,clients,tripSubscriptions)=>{
  let message;

  try {
    message = JSON.parse(data);
  } catch (e) {
    return console.error('Invalid JSON:', e);
  }

  const userId = ws.user.id;
  console.log("handelmessage")
  if (message.type === 'subscribe' && message.tripId) {
   const tripId = message.tripId;
    console.log("inside handelmessage subscribe",message.tripId)
    try {
      // Fetch trip from DB
      const trip = await Trip.findById(tripId).select('members');
      console.log("the trip is",trip)
      if (!trip) {
        return ws.send(JSON.stringify({ type: 'error', message: 'Trip not found' }));
      }

      // Check if user is a member
      const isMember = trip.members.some(memberId => memberId.toString() === userId);
      console.log("the member is",isMember)
      if (!isMember) {
        return ws.send(JSON.stringify({ type: 'error', message: 'Not authorized for this trip' }));
      }

      // Subscribe user to trip
      console.log("the trip subscriptions are",tripSubscriptions)
      if (!tripSubscriptions.has(tripId)) {
        tripSubscriptions.set(tripId, new Set());
      }
      tripSubscriptions.get(tripId).add(userId);
      // console.log("the trip subscriptions after are",tripSubscriptions)

      ws.send(JSON.stringify({ type: 'subscribed', tripId }));

    } catch (err) {
      console.error('Error fetching trip:', err);
      ws.send(JSON.stringify({ type: 'error', message: 'Internal server error' }));
    }
    return;
  }

  if (message.type === 'chat' && message.tripId && message.content) {
    const { tripId, content } = message;
    console.log("the message is",content);
    const members = tripSubscriptions.get(tripId);
    console.log("the members of message is",members);
    if (!members || !members.has(userId)) {
      return ws.send(JSON.stringify({ type: 'error', message: 'Not subscribed to trip' }));
    }
   let {username} =  await User.findOne({_id:userId});
    const chatMessage = {
      type: 'chat',
      tripId,
      content,
      senderId: userId,
      senderName: username,
      timestamp: Date.now()
    };
    console.log("the ws chat message is",username);
    const saveMessage = new Message({
                tripId:tripId,
                senderId:userId,
                senderName:username,
                content:content
            });
    await saveMessage.save()
    for (const memberId of members) {
      console.log("the member is",memberId)
      const clientWs = clients.get(memberId);
      if (clientWs && clientWs.readyState === WebSocket.OPEN) {
        // console.log("the clientWs is",clientWs);
        clientWs.send(JSON.stringify(chatMessage));
      }
    }
  }
}