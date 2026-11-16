interface ErrorMessageProps {
  message: string
}

// הודעת שגיאה שמוצגת במקום המידע כשמשהו נכשל
function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <strong>Something went wrong.</strong>
      <p>{message}</p>
    </div>
  )
}

export default ErrorMessage
