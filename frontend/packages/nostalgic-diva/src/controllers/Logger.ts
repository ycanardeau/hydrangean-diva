// https://source.dot.net/#Microsoft.Extensions.Logging.Abstractions/LogLevel.cs,d07793e8b722b77e,references
export enum LogLevel {
	/**
	 * Logs that contain the most detailed messages. These messages may contain sensitive application data.
	 * These messages are disabled by default and should never be enabled in a production environment.
	 */
	Trace = 0,
	/**
	 * Logs that are used for interactive investigation during development.  These logs should primarily contain
	 * information useful for debugging and have no long-term value.
	 */
	Debug = 1,
	/**
	 * Logs that track the general flow of the application. These logs should have long-term value.
	 */
	Information = 2,
	/**
	 * Logs that highlight an abnormal or unexpected event in the application flow, but do not otherwise cause the
	 * application execution to stop.
	 */
	Warning = 3,
	/**
	 * Logs that highlight when the current flow of execution is stopped due to a failure. These should indicate a
	 * failure in the current activity, not an application-wide failure.
	 */
	Error = 4,
	/**
	 * Logs that describe an unrecoverable application or system crash, or a catastrophic failure that requires
	 * immediate attention.
	 */
	Critical = 5,
	/**
	 * Not used for writing log messages. Specifies that a logging category should not write any messages.
	 */
	None = 6,
}

// https://source.dot.net/#Microsoft.Extensions.Logging.Abstractions/ILogger.cs,0976525f5d1b9e54,references
export interface ILogger {
	isEnabled(logLevel: LogLevel): boolean;
	log(logLevel: LogLevel, message?: any, ...optionalParams: any[]): void;
}

class Logger implements ILogger {
	private readonly title = 'nostalgic-diva';

	private createMessage(message: any): string {
		return `[${this.title}] ${message}`;
	}

	private debug(message?: any, ...optionalParams: any): void {
		console.debug(this.createMessage(message), ...optionalParams);
	}

	private error(message?: any, ...optionalParams: any): void {
		console.error(this.createMessage(message), ...optionalParams);
	}

	private warn(message?: any, ...optionalParams: any): void {
		console.warn(this.createMessage(message), ...optionalParams);
	}

	isEnabled(): boolean {
		return true;
	}

	log(logLevel: LogLevel, message?: any, ...optionalParams: any[]): void {
		switch (logLevel) {
			case LogLevel.Debug:
				this.debug(message, ...optionalParams);
				break;
			case LogLevel.Warning:
				this.warn(message, ...optionalParams);
				break;
			case LogLevel.Error:
				this.error(message, ...optionalParams);
				break;
		}
	}
}

export const defaultLogger = new Logger();
