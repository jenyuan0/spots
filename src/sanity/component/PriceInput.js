import { Card, Flex, Text } from '@sanity/ui';

export const PriceInput = (props) => {
	const { children, title } = props;

	return (
		<Flex justify="left" align="center" gap="10">
			<Text size={1} weight="semibold">
				{title}
			</Text>
			<Flex justify="center" align="center">
				<Card marginRight={1} marginLeft={1}>
					$
				</Card>
				<Flex flex={1}>{children}</Flex>
			</Flex>
		</Flex>
	);
};
