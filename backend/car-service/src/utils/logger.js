
import chalk from "chalk";

const getTime = () => new Date().toISOString();

const logger = {
  info: (service, message) => {
    console.log(chalk.blue(`[${getTime()}] [${service}] INFO: ${message}`));
  },
  success: (service, message) => {
    console.log(chalk.green(`[${getTime()}] [${service}] SUCCESS: ${message}`));
  },
  warn: (service, message) => {
    console.warn(chalk.yellow(`[${getTime()}] [${service}] WARN: ${message}`));
  },
  error: (service, message) => {
    console.error(chalk.red(`[${getTime()}] [${service}] ERROR: ${message}`));
  },
};

export default logger;
