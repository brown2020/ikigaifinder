import Image from "next/image";
import { DEFAULT_COVER } from "@/constants/ikigai";
import { displayStatement } from "@/utils/ikigaiList";

export type CardFormat = "square" | "story" | "wide";

const ASPECT: Record<CardFormat, string> = {
  square: "aspect-square",
  story: "aspect-[9/16]",
  wide: "aspect-[1.91/1]",
};

interface IkigaiCardProps {
  id?: string;
  /** Square for the saved card; story (9:16) and wide (LinkedIn, 1.91:1) for extra downloads. */
  format?: CardFormat;
  statement: string;
  name?: string;
  date?: Date | null;
  imageUrl?: string;
  priority?: boolean;
}

/**
 * The shareable card. Styled inline with hex/rgba values and container-relative
 * units so html2canvas reproduces it faithfully at any capture scale. Sizes use
 * cqmin so type scales with the card's shorter side in every format.
 */
export default function IkigaiCard({ id, format = "square", statement, name, date, imageUrl, priority }: IkigaiCardProps) {
  const text = displayStatement(statement);
  const long = text.length > 180;
  // Stories are viewed full-screen on phones and wide cards have spare width, so the statement can run larger.
  const k = { square: 1, story: 1.3, wide: 1.4 }[format];
  return (
    <div
      id={id}
      className={`relative ${ASPECT[format]} w-full overflow-hidden rounded-2xl`}
      style={{ containerType: "size", backgroundColor: "#1f1a17" }}
    >
      <Image
        src={imageUrl || DEFAULT_COVER}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 600px"
        className="object-cover"
        priority={priority}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,16,14,0.15) 0%, rgba(20,16,14,0.35) 45%, rgba(20,16,14,0.78) 100%)",
        }}
      />
      <div
        className="absolute inset-0 flex flex-col justify-between"
        style={{ padding: "7cqmin", color: "#faf7f2" }}
      >
        <div className="flex items-center" style={{ gap: "2cqmin", fontSize: "2.6cqmin", letterSpacing: "0.2em" }}>
          <span
            style={{
              display: "inline-block",
              width: "2.4cqmin",
              height: "2.4cqmin",
              borderRadius: "9999px",
              backgroundColor: "#d9542a",
            }}
          />
          <span style={{ fontWeight: 600, textTransform: "uppercase" }}>
            {name ? `${name}'s ikigai` : "My ikigai"}
          </span>
        </div>

        <p
          className="font-display"
          style={{
            fontSize: `${(long ? 5 : 6.2) * k}cqmin`,
            lineHeight: 1.22,
            fontWeight: 500,
            textShadow: "0 1px 12px rgba(0,0,0,0.35)",
          }}
        >
          {text}
        </p>

        <div
          className="flex items-end justify-between"
          style={{ fontSize: "2.4cqmin", color: "rgba(250,247,242,0.8)" }}
        >
          <span>
            {date?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span style={{ letterSpacing: "0.04em" }}>ikigaifinder.ai</span>
        </div>
      </div>
    </div>
  );
}
