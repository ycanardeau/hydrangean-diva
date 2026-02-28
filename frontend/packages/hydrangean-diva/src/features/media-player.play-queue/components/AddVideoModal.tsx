import type { PlayQueueItemDto } from '@/features/media-player.play-queue.abstractions/interfaces/PlayQueueItemDto';
import { isNoembedResult } from '@/features/media-player.play-queue/helpers/isNoembedResult';
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
	useGeneratedHtmlId,
} from '@elastic/eui';
import EasyModal, { type InnerModalProps } from 'ez-modal-react';
import { type ReactElement, useState } from 'react';

type AddVideoModalProps = InnerModalProps<PlayQueueItemDto>;

export const AddVideoModal = EasyModal.create(
	({ remove, resolve }: AddVideoModalProps): ReactElement => {
		const modalFormId = useGeneratedHtmlId({ prefix: 'modalForm' });

		const [url, setUrl] = useState('');
		const [title, setTitle] = useState('');
		const [loading, setLoading] = useState(false);

		return (
			<EuiModal onClose={remove} initialFocus="[name=url]">
				<EuiModalHeader>
					<EuiModalHeaderTitle>
						Add video{/* LOC */}
					</EuiModalHeaderTitle>
				</EuiModalHeader>

				<EuiModalBody>
					<EuiForm
						id={modalFormId}
						component="form"
						onSubmit={async (e): Promise<void> => {
							e.preventDefault();

							try {
								setLoading(true);

								const videoService = findVideoService(url);
								if (videoService === undefined) {
									return;
								}

								const videoId =
									videoService.extractVideoId(url);
								if (videoId === undefined) {
									return;
								}

								const response = await fetch(
									`https://noembed.com/embed?url=${encodeURIComponent(url)}`,
								);
								const jsonData = await response.json();

								resolve({
									url: url,
									type: videoService.type,
									videoId: videoId,
									title:
										title ||
										(isNoembedResult(jsonData)
											? jsonData.title
											: videoId),
								});
								remove();
							} finally {
								setLoading(false);
							}
						}}
					>
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
					<EuiButtonEmpty onClick={remove}>
						Cancel{/* LOC */}
					</EuiButtonEmpty>

					<EuiButton
						type="submit"
						form={modalFormId}
						fill
						disabled={url.trim().length === 0}
						isLoading={loading}
					>
						Add video{/* LOC */}
					</EuiButton>
				</EuiModalFooter>
			</EuiModal>
		);
	},
);
