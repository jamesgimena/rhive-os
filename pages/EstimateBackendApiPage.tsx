
import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { PAGE_GROUPS } from '../constants';

const EstimateBackendApiPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-EST-API');

    return (
        <PageContainer title={page?.name || 'Estimate API Backend'} description={page?.description || 'Manage API keys, webhooks, and view logs.'}>
            <div className="space-y-6">
                <Card title="Live Payload Simulation">
                    <p className="text-gray-400 text-sm mb-4">This is the structure sent to the backend when "Request Certified Quote" is clicked.</p>
                    <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-green-400 overflow-x-auto">
                        <pre>{`{
  "project_id": "PROJ-12345",
  "survey_state": {
    "totalSq": 2500,
    "wasteFactor": 10,
    "pitch": "6/12",
    "roofLayers": "1",
    "upgrades": {
      "roof": "TruDefinition® Duration®",
      "gutters": "K-Style"
    },
    "features": {
      "chimneys": 1,
      "skylights": 0
    }
  },
  "pricing_context_version": "v2.1.0",
  "request_type": "CERTIFIED_QUOTE"
}`}</pre>
                    </div>
                </Card>

                <Card title="API Keys">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                            <div>
                                <p className="font-semibold text-white">Production Key</p>
                                <p className="font-mono text-sm text-gray-400">rhive_prod_******************1234</p>
                            </div>
                            <Button variant="secondary">Revoke</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
};

export default EstimateBackendApiPage;
