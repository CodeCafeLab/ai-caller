import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaShoppingCart, FaHeartbeat, FaGraduationCap, FaBuilding, FaMoneyCheckAlt, FaTruck, FaRobot, FaUserTie, FaHeadset, FaChartLine, FaMobileAlt } from "react-icons/fa";
import { Factory } from 'lucide-react';

const industries = [
	{ name: 'E-commerce', desc: 'Order status, returns, and post-purchase follow-ups.', icon: <FaShoppingCart size={24} /> },
	{ name: 'Healthcare', desc: 'Appointment reminders and patient follow-ups.', icon: <FaHeartbeat size={24} /> },
	{ name: 'EdTech', desc: 'Admissions, fee reminders, and placement outreach.', icon: <FaGraduationCap size={24} /> },
	{ name: 'FinTech', desc: 'KYC nudges, payment reminders, and support.', icon: <FaMoneyCheckAlt size={24} /> },
	{ name: 'Logistics', desc: 'Pickup coordination and delivery confirmations.', icon: <FaTruck size={24} /> },
	{ name: 'AI Services', desc: 'Conversational AI, chatbots, and automation.', icon: <FaRobot size={24} /> },
	{ name: 'Professional Services', desc: 'Appointment scheduling and client follow-ups.', icon: <FaUserTie size={24} /> },
	{ name: 'Customer Support', desc: 'Automated support and ticketing reminders.', icon: <FaHeadset size={24} /> },
	{ name: 'Sales & Marketing', desc: 'Lead engagement and campaign follow-ups.', icon: <FaChartLine size={24} /> },
	{ name: 'Telecom', desc: 'Automated call reminders and notifications.', icon: <FaMobileAlt size={24} /> },
];

const cardColors = [
	"bg-[#6DD629]/10 border-[#6DD629] text-[#6DD629]", // green
	"bg-[#FFC012]/10 border-[#FFC012] text-[#FFC012]", // yellow
];

export function Industries() {
	const dup = [...industries, ...industries];
	return (
		<section id="industries" className="pt-6 md:pt-20 pb-6 md:pb-20 py-16 md:py-24">
			<div className="container">
				<div className="mx-auto text-center">
					<div className="flex justify-center mb-3">
						<Factory className="h-10 w-10 text-[#6DD629]" />
					</div>
					<h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground">Industries</h2>
					<p className="mt-4 md:text-lg text-foreground/80">Where AI Caller delivers immediate ROI.</p>
				</div>

				<div className="relative mt-10 overflow-x-hidden overflow-y-visible py-3">
					<div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
					<div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
					<div className="marquee-track flex gap-4" style={{ width: 'max-content', animationDuration: '60s' }}>
						{dup.map((i, idx) => (
							<Card key={i.name + '-' + idx} className={`min-w-[240px] rounded-xl border-2 p-4 flex flex-col gap-2 shadow bg-[hsl(33,31%,10%)] ${cardColors[idx % 2]}`}>
								<CardHeader className="flex flex-row items-center gap-2 pb-1">
									<span>{i.icon}</span>
									<CardTitle className="text-base font-semibold">{i.name}</CardTitle>
								</CardHeader>
								<CardContent className="text-xs opacity-80 pt-0">{i.desc}</CardContent>
							</Card>
						))}
					</div>
				</div>
				<div className="relative mt-5 overflow-x-hidden overflow-y-visible py-3">
					<div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
					<div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
					<div className="marquee-track marquee-reverse flex gap-4 pl-10" style={{ width: 'max-content', animationDuration: '65s' }}>
						{dup.map((i, idx) => (
							<Card key={i.name + '-b-' + idx} className={`min-w-[240px] rounded-xl border-2 p-4 flex flex-col gap-2 shadow bg-[hsl(33,31%,10%)] ${cardColors[(idx + 1) % 2]}`}>
								<CardHeader className="flex flex-row items-center gap-2 pb-1">
									<span>{i.icon}</span>
									<CardTitle className="text-base font-semibold">{i.name}</CardTitle>
								</CardHeader>
								<CardContent className="text-xs opacity-80 pt-0">{i.desc}</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}



