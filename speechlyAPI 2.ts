import { BrowserClient, BrowserMicrophone, Segment } from '@speechly/browser-client'

// Create a new client.
// NOTE: Configure and get your appId from https://api.speechly.com/dashboard
// NOTE: Set vad.enable to true for hands free use
const client = new BrowserClient({
  appId: '7fdcd0a6-ccd5-45b3-8866-59cd86c02b81',
  vad: { enabled: false, noiseGateDb: -24.0 }
})

// Create a microphone
const microphone = new BrowserMicrophone()
// Initialize the microphone - this will ask the user for microphone permissions
// and establish the connection to Speechly API.
// Make sure you call `initialize` from a user action handler
// (e.g. from a button press handler).
await microphone.initialize()

// bind the microphone to the client
await client.attach(microphone.mediaStream)

// React to the updates from the API.
client.onSegmentChange((segment: Segment) => {
  console.log('Received new segment from the API:',
    segment.intent,
    segment.entities,
    segment.words,
    segment.isFinal
  )
})

// Start recording.
// This can be bound to e.g. a button press.
await client.start()

// Stop recording after a timeout.
// This can be bound to e.g. a button press.
setTimeout(async function () {
  await client.stop()
}, 3000)