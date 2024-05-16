import { createSlackReport } from "./index";

describe("createSlackReport", () => {
  it("should send a report to Slack", async () => {
    const slackUrl = "https://slack.com/api/chat.postMessage";
    const message = "Test message";
    const additionalInfo = { key: "value" };

    // Mock the fetch function
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });
    global.fetch = mockFetch;

    const reportToSlack = createSlackReport(slackUrl, mockFetch);
    await reportToSlack(message, additionalInfo);

    expect(mockFetch).toHaveBeenCalledWith(slackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blocks: [
          {
            type: "section",
            text: {
              type: "plain_text",
              text: message,
              emoji: true,
            },
          },
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_preformatted",
                elements: [
                  {
                    type: "text",
                    text: additionalInfo,
                  },
                ],
              },
            ],
          },
        ],
      }),
    });
  });

  it("should throw an error if sending report to Slack fails", async () => {
    const slackUrl = "https://slack.com/api/chat.postMessage";
    const message = "Test message";
    const additionalInfo = { key: "value" };

    // Mock the fetch function to simulate a failed request
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue("Internal Server Error"),
    });
    global.fetch = mockFetch;

    const reportToSlack = createSlackReport(slackUrl, mockFetch);

    await expect(reportToSlack(message, additionalInfo)).rejects.toThrow(
      "Failed to send report to Slack: 500 Internal Server Error"
    );
  });
});
