export default async function Booking({
                                        params,
                                      }: {
  params: Promise<{
    bookingId: string;
  }>;
}) {
  const resolvedParams = await params;
  return (
    <p>{resolvedParams.bookingId}</p>
  )
}