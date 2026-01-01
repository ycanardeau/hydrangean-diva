// https://stackoverflow.com/questions/51504506/too-many-react-context-providers/58924810#58924810
import type {
	JSXElementConstructor,
	PropsWithChildren,
	ReactElement,
	ReactNode,
} from 'react';

interface ComposeProps {
	components: Array<JSXElementConstructor<PropsWithChildren<unknown>>>;
	children?: ReactNode;
}

export const Compose = ({
	components = [],
	children,
}: ComposeProps): ReactElement => {
	return (
		<>
			{components.reduceRight(
				(acc, Component) => (
					<Component>{acc}</Component>
				),
				children,
			)}
		</>
	);
};
