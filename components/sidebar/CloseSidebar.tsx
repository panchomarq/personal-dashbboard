export default function CloseSidebar({
  width,
  height,
}: {
  width: string;
  height: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height={height}
      viewBox="0 0 24 24"
      width={width}
      fill="#e8eaed"
    >
      <g>
        <rect fill="none" height="24" width="24" />
        <g>
          <path d="M2,4v16h20V4H2z M20,8.67h-2.5V6H20V8.67z M17.5,10.67H20v2.67h-2.5V10.67z M4,6h11.5v12H4V6z M17.5,18v-2.67H20V18H17.5z" />
        </g>
      </g>
    </svg>
  );
}
