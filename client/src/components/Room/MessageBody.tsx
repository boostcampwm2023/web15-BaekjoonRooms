export default function MessageBody({
  message,
}: {
  message: string;
}): JSX.Element {
  return <>{makeCodeMessage(message)}</>;
}

function makeCodeMessage(message: string): JSX.Element {
  if (message.startsWith('```') && message.endsWith('```')) {
    return formatCodeMessage(message, 3);
  } else if (message.startsWith('`') && message.endsWith('`')) {
    return formatCodeMessage(message, 1);
  } else {
    return <>{message}</>;
  }
}

function formatCodeMessage(message: string, trimLength: number): JSX.Element {
  const code = message.slice(trimLength, message.length - trimLength);
  return (
    <div className="whitespace-pre-wrap rounded-md bg-bg_secondary p-2">
      {code}
    </div>
  );
}
