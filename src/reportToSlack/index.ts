export const createSlackReport = (slackUrl: string) => {
  return async (message: string, additionalInfo: Record<string, unknown>) => {
    const res = await fetch(slackUrl, {
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

    if (!res.ok) {
      throw new Error(
        `Failed to send report to Slack: ${res.status} ${await res.text()}`
      );
    }

    return res.json();
  };
};
