export type webhookContentsType = {
  text: string;
  embed: string;
  color: number;
}

const defaultPositive: webhookContentsType = {
  text: '',
  embed: '',
  color: 1127128,
};

const defaultNegative: webhookContentsType = {
  text: '@everyone EC2に関して今すぐ確認が必要です！',
  embed: '',
  color: 14177041,
};

const noRunningInstances: webhookContentsType = {
  ...defaultPositive,
  embed: '実行中のインスタンスはありません。',
};

const runningInstances: webhookContentsType = {
  ...defaultNegative,
  embed: 'インスタンスが実行中です。',
};

const startedInstances: webhookContentsType = {
  ...defaultNegative,
  embed: 'インスタンスを起動しました。',
};

const noInstancesToRun: webhookContentsType = {
  ...defaultPositive,
  embed: '起動するインスタンスはありません。',
};

export {
  noRunningInstances,
  runningInstances,
  startedInstances,
  noInstancesToRun,
};
