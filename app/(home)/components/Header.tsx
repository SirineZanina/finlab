import { ArrowRight } from "@/components/assets/icons/ArrowRight";
import { FinlabLogo } from "@/components/assets/logos/FinlabLogo";
import { MenuIcon } from "@/components/assets/icons/MenuIcon"
import Link from "next/link";

const Header = () => {
  return (
	<header className="sticky top-0">
			<div className='flex justify-center items-center py-3 bg-black text-white text-sm gap-3'>
				<p className="text-white/60 hidden md:block ">
					Manage your cashflow and boost your finances.
				</p>
				<div className="inline-flex items-center gap-1">
					<p>Get started for free</p>
					<ArrowRight className="h-4 w-4 inline-flex justify-center items-center"/>
				</div>
			</div>
		<div className="py-5">
			<div className="container">
				<div className="flex items-center justify-between">
					<FinlabLogo className="w-10 h-10 fill-primary-500" />
					<MenuIcon className="h-5 w-5 md:hidden" />
					<nav className="hidden md:flex gap-6 text-black/60 items-center">
						<Link href="/">Home</Link>
						<Link href="#features">Features</Link>
						<Link href="#testimonials">Testimonials</Link>
						<Link href="#updates">Updates</Link>
						<Link href="/help">Help</Link>
						
						<Link href="/sign-up">
							<button className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium inline-flex 
											items-center justify-center tracking-tight">
							Get for free
							</button>
						</Link>
					</nav>
				</div>
			</div>
		</div>
	</header>
  	)
}

export default Header
