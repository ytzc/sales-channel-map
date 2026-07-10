import React from 'react';
import ChannelDetailClient from './ChannelDetailClient';
import { mockChannels } from '@/data/mock';

export async function generateStaticParams() {
  return mockChannels.map((channel) => ({
    id: channel.id,
  }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <ChannelDetailClient params={params} />;
}
