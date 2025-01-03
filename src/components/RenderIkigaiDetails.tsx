type RenderIkigaiDetailsT = {
  Icon: React.ElementType;
  title: string;
  description: string;
  color: string;
};
export default function RenderIkigaiDetails({
  Icon,
  title,
  description,
  color,
}: RenderIkigaiDetailsT) {
  return (
    <div className="flex items-center justify-center gap-6">
      <div className="sm:p-6 relative pt-11">
        <div className="flex item gap-1">
          <div className="mt-[1px]">
            <Icon color={color} className="sm:text-3xl text-2xl" />
          </div>
          <h1 className="sm:text-3xl text-2xl font-bold leading-none">{title}</h1>
        </div>
        <p className="font-medium mt-8">{description}</p>
      </div>
    </div>
  );
}
