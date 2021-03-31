import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Response } from 'node-fetch';
import { webhookContentsType } from '../domains/webhookContents';
import post from './httpWrapper';

const postToDiscord = async (instanceIds: string[], contents: webhookContentsType): Promise<Response> => {
  const requestData = {
    username: 'EC2-Auto-Stop',
    avatar_url: 'https://i.gyazo.com/5e6236efcc9c6d6f3bbf6253aa38ea31.png',
    content: `[${format(
      utcToZonedTime(new Date(), 'Asia/Tokyo'),
      'yyyy/MM/dd HH:mm:ss',
    )}]\n${contents.text}`,
    embeds: [
      {
        title: 'EC2 Notifications',
        url:
          'https://us-west-2.console.aws.amazon.com/ec2/v2/home?region=us-west-2#Instances:',
        description: contents.embed,
        color: contents.color,
        fields: [
          {
            name: 'instance_ids',
            value: instanceIds.length === 0 ? '[]' : instanceIds.join(', '),
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return post(process.env.WEBHOOK_EC2, requestData);
};

export default postToDiscord;
