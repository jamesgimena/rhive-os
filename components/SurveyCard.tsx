
import React from 'react';
import type { SurveyState, RoofLayers, EaveOverhang } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { GutterIcon, HeatTraceIcon, Building } from './icons';

interface SurveyCardProps {
    title: string;
    surveyState: SurveyState;
    onSurveyChange: React.Dispatch<React.SetStateAction<SurveyState>>;
    section: 'roof' | 'gutters' | 'heatTrace';
    defaultOpen?: boolean;
}

export const SurveyCard: React.FC<SurveyCardProps> = ({ title, surveyState, onSurveyChange, section, defaultOpen = false }) => {
    
    const handleValueChange = (field: string, value: any) => {
        onSurveyChange(prev => {
            const sectionState = prev[section];
            const updatedSection = { ...sectionState, [field]: value };
            return { ...prev, [section]: updatedSection };
        });
    };

    const handleFeatureChange = (feature: 'chimneys' | 'swampCoolers' | 'skylights', value: number) => {
        onSurveyChange(prev => ({
            ...prev,
            roofFeatures: { ...prev.roofFeatures, [feature]: value }
        }));
    };
    
    const renderContent = () => {
        switch (section) {
            case 'roof':
                return <RoofOptionsContent surveyState={surveyState} onFeatureChange={handleFeatureChange} onLayerChange={(v) => onSurveyChange(p => ({...p, roofLayers: v}))} />;
            case 'gutters':
                return <GutterOptionsContent surveyState={surveyState} onValueChange={handleValueChange} />;
            case 'heatTrace':
                return <HeatTraceOptionsContent surveyState={surveyState} onValueChange={handleValueChange} />;
            default:
                return null;
        }
    }

    const icons = {
        roof: <Building className="h-6 w-6" />,
        gutters: <GutterIcon className="h-6 w-6" />,
        heatTrace: <HeatTraceIcon className="h-6 w-6" />
    };

    const cardContent = (
        <Card className="bg-gray-900/50 border border-pink-500/50">
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <div className="bg-pink-900/30 p-2 rounded-md">{icons[section]}</div>
                    <CardTitle>{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );

    if (defaultOpen) {
        return cardContent;
    }

    return (
        <Accordion type="single" collapsible defaultValue={undefined}>
            <AccordionItem value={section} className="border-none">
                <Card className="bg-gray-900/50 border border-pink-500/50 overflow-hidden">
                    <AccordionTrigger className="p-6 hover:no-underline">
                         <div className="flex items-center space-x-3">
                            <div className="bg-pink-900/30 p-2 rounded-md">{icons[section]}</div>
                            <CardTitle>{title}</CardTitle>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6">
                        {renderContent()}
                    </AccordionContent>
                </Card>
            </AccordionItem>
        </Accordion>
    );
};

// --- Specific Content Components ---

const RoofOptionsContent: React.FC<{ surveyState: SurveyState, onFeatureChange: (f: any, v: number) => void, onLayerChange: (v: RoofLayers) => void }> = ({ surveyState, onFeatureChange, onLayerChange }) => (
    <div className="space-y-6">
        <div>
            <Label>How many layers are on your project?</Label>
            <RadioGroup value={surveyState.roofLayers} onValueChange={(v) => onLayerChange(v as RoofLayers)} className="grid grid-cols-3 gap-2 mt-2">
                {['1', '2', '3', '4', 'IDK', 'Other'].map(val => (
                    <div key={val} className="flex items-center">
                        <RadioGroupItem value={val} id={`layers-${val}`} />
                        <Label htmlFor={`layers-${val}`} className="ml-2">{val}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
        <div>
            <Label>Indicate the quantity of each feature on the roof:</Label>
            <div className="mt-2 space-y-2">
                {Object.keys(surveyState.roofFeatures).map(key => (
                     <div key={key} className="flex items-center justify-between p-3 rounded-md bg-gray-800/50 border border-gray-700">
                        <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                        <Input id={key} type="number" value={surveyState.roofFeatures[key as keyof typeof surveyState.roofFeatures]} onChange={e => onFeatureChange(key, Number(e.target.value))} className="w-20 h-8" min="0" />
                     </div>
                ))}
            </div>
        </div>
    </div>
);

const GutterOptionsContent: React.FC<{ surveyState: SurveyState, onValueChange: (f: string, v: any) => void }> = ({ surveyState, onValueChange }) => (
    <div className="space-y-4">
        <div>
            <Label>How many feet of gutters are on your project?</Label>
            <Input type="number" placeholder="Ex: 120" value={surveyState.gutters.length || ''} onChange={e => onValueChange('length', Number(e.target.value))} />
        </div>
        <div>
            <Label>How many miters (gutter corners) are on your project?</Label>
            <Input type="number" placeholder="Ex: 6" value={surveyState.gutters.miters || ''} onChange={e => onValueChange('miters', Number(e.target.value))} />
        </div>
        <div>
            <Label>Downspout Length (quantity per story)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
                 <div className="p-3 rounded-md bg-gray-800/50 border border-gray-700">
                    <Label htmlFor="ds2">2-Story</Label>
                    <Input id="ds2" type="number" value={surveyState.gutters.downspouts2Story || ''} onChange={e => onValueChange('downspouts2Story', Number(e.target.value))} className="w-full h-8 mt-1" min="0"/>
                </div>
                 <div className="p-3 rounded-md bg-gray-800/50 border border-gray-700">
                    <Label htmlFor="ds3">3-Story</Label>
                    <Input id="ds3" type="number" value={surveyState.gutters.downspouts3Story || ''} onChange={e => onValueChange('downspouts3Story', Number(e.target.value))} className="w-full h-8 mt-1" min="0"/>
                </div>
            </div>
        </div>
    </div>
);

const HeatTraceOptionsContent: React.FC<{ surveyState: SurveyState, onValueChange: (f: string, v: any) => void }> = ({ surveyState, onValueChange }) => (
     <div className="space-y-4">
        <div>
            <Label>What's the total length (in feet) of heat trace installed?</Label>
            <Input type="number" placeholder="Ex: 63FT" value={surveyState.heatTrace.length || ''} onChange={e => onValueChange('length', Number(e.target.value))} />
        </div>
        {/* Fix: Replace single downspout input with per-story inputs to match data model. */}
        <div>
            <Label>Downspout Quantity (with heat trace)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
                 <div className="p-3 rounded-md bg-gray-800/50 border border-gray-700">
                    <Label htmlFor="ht-ds1">1-Story</Label>
                    <Input id="ht-ds1" type="number" value={surveyState.heatTrace.downspouts1Story || ''} onChange={e => onValueChange('downspouts1Story', Number(e.target.value))} className="w-full h-8 mt-1" min="0"/>
                </div>
                 <div className="p-3 rounded-md bg-gray-800/50 border border-gray-700">
                    <Label htmlFor="ht-ds2">2-Story</Label>
                    <Input id="ht-ds2" type="number" value={surveyState.heatTrace.downspouts2Story || ''} onChange={e => onValueChange('downspouts2Story', Number(e.target.value))} className="w-full h-8 mt-1" min="0"/>
                </div>
                 <div className="p-3 rounded-md bg-gray-800/50 border border-gray-700">
                    <Label htmlFor="ht-ds3">3-Story</Label>
                    <Input id="ht-ds3" type="number" value={surveyState.heatTrace.downspouts3Story || ''} onChange={e => onValueChange('downspouts3Story', Number(e.target.value))} className="w-full h-8 mt-1" min="0"/>
                </div>
                 <div className="p-3 rounded-md bg-gray-800/50 border border-gray-700">
                    <Label htmlFor="ht-ds4">4-Story</Label>
                    <Input id="ht-ds4" type="number" value={surveyState.heatTrace.downspouts4Story || ''} onChange={e => onValueChange('downspouts4Story', Number(e.target.value))} className="w-full h-8 mt-1" min="0"/>
                </div>
            </div>
        </div>
        <div>
            <Label>Which eave overhang looks most like your home?</Label>
            {/* Fix: Corrected eave overhang options to match the EaveOverhang type. */}
            <RadioGroup value={surveyState.heatTrace.eaveOverhang} onValueChange={(v) => onValueChange('eaveOverhang', v as EaveOverhang)} className="grid grid-cols-2 gap-2 mt-2">
                {['None', 'Small', 'Medium', 'Large'].map(val => (
                     <Label key={val} htmlFor={`eave-${val}`} className="p-3 border rounded-md has-[:checked]:border-pink-500 has-[:checked]:bg-pink-900/20 text-center cursor-pointer">
                        <RadioGroupItem value={val} id={`eave-${val}`} className="sr-only"/>
                        {val}
                    </Label>
                ))}
            </RadioGroup>
        </div>
    </div>
);
