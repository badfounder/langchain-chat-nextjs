export default async function (req, res) {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log(req.body);

  const message = req.body.question; // Change this line
  console.log(message);
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an extremely helpful and concise friend, answering in one SMS length go, if the user says their name is Silvia, tell her Clayton loves her, if its Ali, tell him Clayton is a 10x engineer or more",
        },
        { role: "user", content: message },
      ],
    });

    const chatGptResponse = completion.data.choices[0].message.content;
    console.log("ChatGPT response:", chatGptResponse);
    res.status(200).json({ result: chatGptResponse });
  } catch (error) {
    console.error(`Error while fetching ChatGPT response: ${error.message}`);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error", error.message);
    }
    console.error(error.stack);
    res
      .status(500)
      .json({ error: "Chatty G is asleep, and Clayton can't code." });
  }
}
