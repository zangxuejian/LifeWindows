import {
  Activity,
  Baby,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  Ear,
  Eye,
  GraduationCap,
  HeartPulse,
  House,
  MessageCircle,
  Music2,
  Plane,
  ShieldCheck,
  Smile,
  Sparkles,
  Sprout,
  UsersRound,
  WalletCards,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { WindowIcon as WindowIconName } from "../types";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconMap: Record<WindowIconName, IconComponent> = {
  activity: Activity,
  baby: Baby,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  compass: Compass,
  ear: Ear,
  eye: Eye,
  heart: HeartPulse,
  home: House,
  music: Music2,
  plane: Plane,
  school: GraduationCap,
  shield: ShieldCheck,
  smile: Smile,
  sparkles: Sparkles,
  speech: MessageCircle,
  sprout: Sprout,
  tooth: ToothIcon,
  users: UsersRound,
  wallet: WalletCards,
};

function ToothIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 4.1c2.1 0 2.6-1.3 4.6-1.3 2.5 0 4.2 2.2 4 5-.2 2.4-1.4 4.1-2 6.5-.7 2.8-.8 6.8-3.2 6.8-1.8 0-1.6-5.5-3.4-5.5s-1.6 5.5-3.4 5.5c-2.4 0-2.5-4-3.2-6.8-.6-2.4-1.8-4.1-2-6.5-.2-2.8 1.5-5 4-5 2 0 2.5 1.3 4.6 1.3Z" />
    </svg>
  );
}

export function WindowIcon({ name, size = 22, className }: { name: WindowIconName; size?: number; className?: string }) {
  const Icon = iconMap[name];
  return <Icon width={size} height={size} className={className} aria-hidden="true" />;
}
