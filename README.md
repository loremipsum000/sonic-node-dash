# Sonic Node Dash

A Next.js dashboard for interacting with Sonic nodes, featuring real-time monitoring and management capabilities. Built with TypeScript and GraphQL for robust type safety and efficient data handling.

## What it does

- **Node Monitoring**: Track your Sonic node's performance, status, and network metrics in real-time
- **Transaction Management**: View and manage transactions flowing through your node
- **Network Analytics**: Visualize network statistics and node performance data using Recharts
- **Automated Alerts**: Get notified about important node events and potential issues
- **Multi-Node Support**: Manage multiple Sonic nodes from a single dashboard

## Quick Start

1. Clone and install:
```bash
git clone https://github.com/loremipsum000/sonic-node-dash.git
cd sonic-node-dash
npm install
```

2. Set up your environment:
```env
NEXT_PUBLIC_API_URL=your_sonic_node_api_endpoint
```

3. Run it:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Layout

```
sonic-node-dash/
├── app/
│   ├── api/graphql/    # GraphQL endpoint for node data
│   ├── components/     # Dashboard UI components
│   ├── hooks/         # Node data hooks
│   └── page.tsx       # Main dashboard view
├── components/         # Shared components
├── graphql/           # Node queries and mutations
└── lib/               # Node utilities and helpers
```

## Core Features

### Node Management
- Connect to your Sonic node
- View node status and health metrics
- Manage node configuration
- Monitor network connectivity

### Transaction Monitoring
- Real-time transaction feed
- Transaction history and details
- Performance metrics
- Fee analysis

### Network Stats
- Network participation metrics
- Peer connections
- Bandwidth usage
- Block propagation data

### Alert System
- Custom alert configurations
- Email notifications
- Performance threshold alerts
- Network status updates

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Generate GraphQL types
npm run codegen
```

## Tech Details

- **Next.js 13.5**: App router and server components
- **GraphQL**: Direct node data querying
- **TypeScript**: Full type coverage
- **shadcn/ui**: Dashboard components
- **Recharts**: Performance visualizations
- **TailwindCSS**: Custom styling
- **Apollo Client**: Node data caching

## Environment Setup

Required variables:
```env
NEXT_PUBLIC_API_URL=your_sonic_node_endpoint
```

Optional features:
```env
ENABLE_ALERTS=true
ALERT_EMAIL=admin@example.com
```

## Contributing

Found a bug or want to contribute? Check our [contribution guidelines](CONTRIBUTING.md) and:

1. Fork it
2. Create your feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push (`git push origin feature/improvement`)
5. Open a Pull Request

## Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/loremipsum000/sonic-node-dash/issues)
- Discord: [Join our community](https://discord.gg/sonic-node) 