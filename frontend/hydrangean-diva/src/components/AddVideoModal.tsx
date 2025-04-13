import { PlayQueueItemDto } from '@/stores/IPlayQueueItemStore';
import { findVideoService } from '@aigamo/nostalgic-diva';
import {
	EuiButton,
	EuiButtonEmpty,
	EuiFieldText,
	EuiForm,
	EuiFormRow,
	EuiModal,
	EuiModalBody,
	EuiModalFooter,
	EuiModalHeader,
	EuiModalHeaderTitle,
} from '@elastic/eui';
import React from 'react';

interface NoembedResult {
	title: string;
}

function isNoembedResult(value: any): value is NoembedResult {
	return (
		value !== null &&
		typeof value === 'object' &&
		'title' in value &&
		typeof value.title === 'string'
	);
}

interface AddVideoModalProps {
	url?: string;
	title?: string;
	onCancel: () => void;
	onSave: (e: PlayQueueItemDto) => Promise<void>;
}

export const AddVideoModal = ({
	onCancel,
	onSave,
	...props
}: AddVideoModalProps): React.ReactElement => {
	const [url, setUrl] = React.useState(props.url ?? '');
	const [title, setTitle] = React.useState(props.title ?? '');
	const [loading, setLoading] = React.useState(false);

	return (
		<EuiModal onClose={onCancel} initialFocus="[name=url]">
			<EuiModalHeader>
				<EuiModalHeaderTitle>Add video{/* LOC */}</EuiModalHeaderTitle>
			</EuiModalHeader>

			<EuiModalBody>
				<EuiForm component="form">
					<EuiFormRow label="URL" /* LOC */>
						<EuiFieldText
							name="url"
							value={url}
							onChange={(e): void => setUrl(e.target.value)}
						/>
					</EuiFormRow>

					<EuiFormRow label="Title">
						<EuiFieldText
							name="title"
							value={title}
							onChange={(e): void => setTitle(e.target.value)}
						/>
					</EuiFormRow>
				</EuiForm>
			</EuiModalBody>

			<EuiModalFooter>
				<EuiButtonEmpty onClick={onCancel}>
					Cancel{/* LOC */}
				</EuiButtonEmpty>

				<EuiButton
					type="submit"
					onClick={async (): Promise<void> => {
						try {
							setLoading(true);

							const videoService = findVideoService(url);
							if (videoService !== undefined) {
								const videoId =
									videoService.extractVideoId(url);
								if (videoId !== undefined) {
									const response = await fetch(
										`https://noembed.com/embed?url=${encodeURIComponent(
											url,
										)}`,
									);
									const jsonData = await response.json();

									await onSave({
										url: url,
										type: videoService.type,
										videoId: videoId,
										title:
											title ||
											(isNoembedResult(jsonData)
												? jsonData.title
												: videoId),
									});
								}
							}
						} finally {
							setLoading(false);
						}
					}}
					fill
					disabled={url.trim().length === 0}
					isLoading={loading}
				>
					Save{/* LOC */}
				</EuiButton>
			</EuiModalFooter>
		</EuiModal>
	);
};
