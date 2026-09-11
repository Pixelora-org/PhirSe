# Phir Se

**give it a second life**

A Next.js demo app for India household recycling drop-offs with points tracking and partner revenue calculator.

## About

Phir Se helps residents log their recycling drop-offs and earn points while giving partners visibility into revenue streams from different waste categories. The app demonstrates the distinction between scrap-market materials (cardboard, PET, rigid plastic) and certificate-based materials (film, wrappers, MLP) in India's EPR ecosystem.

## Features

### Resident View
- Select drop-off location from Bangalore-area collection points
- Log recyclables across four categories with different point values
- Track total points earned and kg recycled
- View recent drop-off history
- See available reward redemptions

### Partner Dashboard
- View total collection statistics
- Breakdown by waste category
- Edit placeholder revenue rates (scrap market, certificate, reward cost)
- Visual split between scrap and certificate streams
- Calculate net partner margins

### Categories
1. **Cardboard & Paper** — 2 pts/kg — scrap market
2. **PET Bottles & Metal** — 3 pts/kg — scrap market
3. **Mixed Rigid Plastic** — 2 pts/kg — scrap market
4. **Film, Wrappers & Sachets** — 10 pts/kg — certificate-based (highest value)

## Important Notice

**This is a demonstration app with placeholder revenue rates.** 

In India's Extended Producer Responsibility (EPR) system, generating EPR certificates requires registration with a CPCB-approved Plastic Waste Processor. This application does not mint credits or certificates. The rates shown are editable examples for exploring business models only.

Film, wrappers, and multi-layer plastic (MLP) earn higher points because they correspond to certificate-based revenue in India's EPR framework, while materials like cardboard, PET, and rigid plastics trade on traditional scrap markets at different rates.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Fonts**: Barlow Condensed, IBM Plex Sans, IBM Plex Mono
- **localStorage** for client-side persistence

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Usage

All data is stored in browser localStorage, so it persists between sessions but is local to each device.

1. **Resident Mode**: Select a location, choose a waste category, enter weight in kg, and log your drop-off
2. **Partner Mode**: View collection statistics and adjust revenue rate assumptions to model different scenarios

## Design

Colors:
- Ink: `#1C2B22`
- Paper: `#F6F4EE`
- Gold: `#C98A2C` (brand accent)
- Category colors: Cardboard `#A9754A`, PET/Metal `#3B6E8F`, Rigid `#7C8792`

Fonts from Google Fonts:
- Barlow Condensed (brand)
- IBM Plex Sans (body)
- IBM Plex Mono (numbers)

## License

ISC

## Repository

https://github.com/Pixelora-org/PhirSe
