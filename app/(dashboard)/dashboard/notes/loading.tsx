import { DashboardHeader } from '@/components/header'
import { PostItem } from '@/components/post-item'
import { DashboardShell } from '@/components/shell'

export default function DashboardLoading() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Your Notes"
				text="problems with your notes"
			></DashboardHeader>
			<div className="divide-border-200 divide-y rounded-md border">
				<PostItem.Skeleton />
				<PostItem.Skeleton />
				<PostItem.Skeleton />
				<PostItem.Skeleton />
				<PostItem.Skeleton />
			</div>
		</DashboardShell>
	)
}