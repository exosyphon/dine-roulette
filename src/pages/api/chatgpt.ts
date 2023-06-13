// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatGPTAPI } from 'chatgpt';

type Restaurant = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

type Data = {
  restaurants: Restaurant[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const api = new ChatGPTAPI({
    apiKey: process.env.CHAT_API_KEY,
  });

  // const chatGptResponse = await api.sendMessage(
  //   `Show me a list of suggestions for a restaurant near zipcode ${req.body.userLocation} that serves ${req.body.style} ${req.body.food} in JSON format with restaurants as the key for the suggestions and only give me the JSON with name, latitude, longitude, address, no other text`
  // );
  // TODO: add error handling when bad response from ChatGPT
  // console.log(chatGptResponse);
  // res.status(200).json(JSON.parse(chatGptResponse.text));
  res.status(200).json({restaurants: [{name: 'another place', address: '3965 Old Parker Rd, St Paul, TX 75098'}, {name: 'test place', address: '809 Woodbridge Pkwy Ste 400, Wylie, TX 75098'}]});
}
