import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaShoppingCart, FaHeartbeat, FaGraduationCap, FaBuilding, FaMoneyCheckAlt, FaTruck, FaRobot, FaUserTie, FaHeadset, FaChartLine, FaMobileAlt } from "react-icons/fa";

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
	return (
		<section id="industries" className="py-20 md:py-28">
			<div className="container">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">Industries</h2>
					<p className="mt-4 md:text-lg text-foreground/80">Where AI Caller delivers immediate ROI.</p>
				</div>
				<div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{industries.map((i, idx) => (
						<Card
							key={i.name}
							className={`rounded-xl border-2 p-3 flex flex-col items-start gap-2 shadow transition ${cardColors[idx % 2]} bg-[hsl(33,31%,10%)]`}
						>
							<CardHeader className="flex flex-row items-center gap-2 pb-1">
								<span>{i.icon}</span>
								<CardTitle className="text-base font-semibold">{i.name}</CardTitle>
							</CardHeader>
							<CardContent className="text-xs opacity-80 pt-0">{i.desc}</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}



