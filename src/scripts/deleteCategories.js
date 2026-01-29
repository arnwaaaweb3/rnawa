import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'msi9c7b6',
  dataset: 'production',
  token:'skgaB4I5dF6CjciIwqQIDQIy5STwH7LGOLlHQi8IN9W112C2p00SlWcmycfvHGmvJcYv3yZijIMegtHxaB4DDifWfzOHcgQNELlgj4dE78lEFPZlNXeCnIYcZbi2TIj2fdleTEijBmfhJJNXUAbqYNTtOHnfBoEW61e3HMPIp3aI19DDYAki',
  useCdn: false,
  apiVersion: '2024-01-01',
})

const ids = [
  "06d79ee6-27ee-474e-9a38-e5abef253fc7",
  "1d17561c-426a-4218-9c3b-09bb22143bf6",
  "2b0d1864-d92e-477b-b38c-9ce75bfa5488",
  "32300afd-fdf7-4c22-be26-e31286573143",
  "5a07ecc7-67e8-4495-94a4-d5af93e1a18a",
  "6b9ccd3d-fcc6-49d4-86ed-55d0afe55a73",
  "76a5cdc4-d8a2-40bc-ada1-d078f7836fb9",
  "7a1fd39d-b5db-4dd8-854e-93a8cb5820ea",
  "85354bca-ca2b-4c33-9af0-2d6703af1228",
  "8d296c1b-c337-4666-8ff5-7d16e90f5d78",
  "e5fe02f2-78c9-41b6-ad13-57e0ca892a05",
  "f5225a21-faa9-4632-a2b2-8e709a7ee515"
]

async function run() {
  for (const id of ids) {
    try {
      await client.delete(id)
      console.log(`✅ Deleted: ${id}`)
    } catch (err) {
      console.error(`❌ Failed: ${id}`, err.message)
    }
  }
  console.log('🔥 Cleanup finished')
}

run()
