import re

target_file = r'c:\Users\mjrob\OneDrive\Desktop\App Repo s\RHIVE-OS-1.0\pages\CustomerInputPage.tsx'

with open(target_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace states
old_states = """    const [isBillingConfirmed, setIsBillingConfirmed] = useState(false);
    const [scopeType, setScopeType] = useState<'Repair' | 'Replacement' | 'Both' | null>(null);
    const [activeLeak, setActiveLeak] = useState<'Yes' | 'No' | null>(null);
    const [emergencyTarp, setEmergencyTarp] = useState<'Yes' | 'No' | null>(null);
    const [roofAge, setRoofAge] = useState<'>15 Years' | '<15 Years' | 'I don\\'t know' | null>(null);
    const [damageCause, setDamageCause] = useState<'Storm Damage' | 'Insurance Inspection' | 'Old Roof / Need Quote' | null>(null);
    const [buyerIntent, setBuyerIntent] = useState<'Repair Estimate' | 'Instant Estimate' | 'Certified Quote' | 'Schedule Inspection' | null>(null);
    const [intakeData, setIntakeData] = useState({ layers: '', chimneys: '', swampCoolers: '', skylights: '', gutters: '', heatTrace: '', soffit: '' });
    const [isIntentCollapsed, setIsIntentCollapsed] = useState(false);
    const [ladderSize, setLadderSize] = useState<'1-Story (Reach)' | '2-Story (Extension)' | 'Steep/3-Story (Specialty)' | null>(null);
    const [roofAccessNotes, setRoofAccessNotes] = useState<string[]>([]);
    const [scheduledDetails, setScheduledDetails] = useState<string | null>(null);

    useEffect(() => {
        if (projectReason === 'Regular Repair') setScopeType('Repair');
        else if (projectReason === 'Regular Replacement' || projectReason === 'Insurance / Storm Claim') setScopeType('Replacement');
        else if (projectReason === 'Both (Repair & Replace)') setScopeType('Both');
    }, [projectReason]);"""

new_states = """    const [isBillingConfirmed, setIsBillingConfirmed] = useState(false);
    const [scopeType, setScopeType] = useState<'Repair' | 'Replacement' | null>(null);
    const [activeLeak, setActiveLeak] = useState<'Yes' | 'No' | null>(null);
    const [roofAge, setRoofAge] = useState<'Yes (<15 Years)' | 'No (>15 Years)' | null>(null);
    const [hasPhotos, setHasPhotos] = useState<'Yes, I have photos' | 'No photos yet' | null>(null);
    const [buyerIntent, setBuyerIntent] = useState<'Repair Estimate' | 'Instant Estimate' | 'Certified Quote' | 'Schedule Inspection' | null>(null);
    const [isIntentCollapsed, setIsIntentCollapsed] = useState(false);
    const [scheduledDetails, setScheduledDetails] = useState<string | null>(null);
    
    // Form Data Matrix
    const [intakeData, setIntakeData] = useState({
        layers: '1',
        accessType: '',
        laddersRequired: [] as string[],
        chimneys: '0',
        skylights: '0',
        swampCoolers: '0',
        gutterFeet: '0',
        gutterMiters: '0',
        gutterDownspouts: { '1-Story': '0', '2-Story': '0', '3-Story': '0', '4-Story': '0' },
        heatTraceLength: '',
        heatTraceDownspouts: { '1-Story': '0', '2-Story': '0', '3-Story': '0', '4-Story': '0' },
        heatTraceOverhang: 'None',
        roofMaterial: '',
        decking: '',
        satelliteDish: 'N/A',
        swampCoolerDropdown: 'N/A',
        solarPanelsDropdown: 'N/A - No Solar',
        additionalStructures: '',
        projectDetails: '',
        mainConcerns: [] as string[],
        decisionProcess: [] as string[],
        familiarity: 'Homeowner (Beginner)',
        investmentStyle: 'Value Driven',
        readinessToStart: ''
    });

    const handleIntakeChange = (field: string, value: any) => {
        setIntakeData(prev => ({ ...prev, [field]: value }));
    };"""

text = text.replace(old_states, new_states)

text = text.replace(
    "const isInspectionRequired = isCommercialOrGov || isInsurance || buyerIntent === 'Schedule Inspection' || buyerIntent === 'Certified Quote' || buyerIntent === 'Repair Estimate';",
    "const isInspectionRequired = isCommercialOrGov || isInsurance || buyerIntent === 'Schedule Inspection' || buyerIntent === 'Certified Quote' || (scopeType === 'Repair' && hasPhotos === 'No photos yet');"
)

# Start replacing from section 5 down to 1162
start_idx = text.find('{/* 5. ROOF CONDITION & INTENT */}')
end_idx = text.find('</form>')

if start_idx != -1 and end_idx != -1:
    new_ui = """{/* 5. PROJECT INTENT */}
                <Card className="shadow-2xl mb-6">
                    <CardContent className="p-8 space-y-8">
                        <SectionHeader title="Project Intent" icon={BriefcaseIcon} />
                        <div className="space-y-6">
                            
                            <div>
                                <QuestionLabel>Is this for a Repair or Replacement?</QuestionLabel>
                                <ToggleGroup options={['Replacement', 'Repair']} value={scopeType as any} onChange={v => { setScopeType(v as any); setBuyerIntent(null); }} />
                            </div>

                            {scopeType && (
                                <div className="animate-fade-in p-5 border border-gray-800 bg-black/20 backdrop-blur-md rounded-xl mt-4">
                                    <div className="mb-4">
                                        <QuestionLabel>Do you have an active leak?</QuestionLabel>
                                        <ToggleGroup options={['Yes', 'No']} value={activeLeak as any} onChange={v => setActiveLeak(v as any)} />
                                    </div>
                                    <div className="mb-4">
                                        <QuestionLabel>Is the roof younger than 15 years old?</QuestionLabel>
                                        <ToggleGroup options={['Yes (<15 Years)', 'No (>15 Years)']} value={roofAge as any} onChange={v => setRoofAge(v as any)} />
                                    </div>

                                    {scopeType === 'Repair' && roofAge === 'Yes (<15 Years)' && (
                                        <div className="animate-fade-in mt-6 pt-6 border-t border-gray-800">
                                            <p className="text-sm text-gray-400 italic mb-4">"If the roof is relatively new, a good photo can help us quote the repair faster. Do you have high quality photos you can send now?"</p>
                                            <ToggleGroup options={['Yes, I have photos', 'No photos yet']} value={hasPhotos as any} onChange={v => setHasPhotos(v as any)} />
                                            
                                            {hasPhotos === 'No photos yet' && (
                                                <div className="mt-6 flex flex-col gap-4">
                                                    <button type="button" className="w-full bg-[#ec028b] text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#ec028b]/80 transition-all">
                                                        <CloudArrowUpIcon className="w-5 h-5" /> Send Photo Upload Link to Customer
                                                    </button>
                                                    <p className="text-[#e2ab49] text-xs font-bold font-mono tracking-tight flex items-center gap-2">
                                                        <WrenchIcon className="w-4 h-4" /> No instant pricing available without on-site inspection or property photos.
                                                    </p>
                                                    
                                                    <div className="mt-8 border border-[#ec028b]/30 bg-[#ec028b]/5 rounded-xl p-6">
                                                        <h4 className="text-[#ec028b] font-black text-xs uppercase tracking-widest mb-4">INSPECTION REQUIRED</h4>
                                                        <div className="bg-black/40 border border-gray-800 rounded-lg p-6">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <CalendarDaysIcon className="text-white w-6 h-6" />
                                                                <span className="text-white font-black text-lg">Schedule Inspection</span>
                                                            </div>
                                                            <p className="text-gray-500 text-[10px] font-bold uppercase mb-6">Booking protocol: 1.5 HR Window + 30 MIN Buffer</p>
                                                            <CalendarWidget onSelectSlot={s => { setScheduledDetails(s); setBuyerIntent('Schedule Inspection'); }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {scopeType === 'Replacement' && (
                                        <div className="mt-6 pt-6 border-t border-gray-800 animate-fade-in">
                                            <QuestionLabel>Where are they in the buying process?</QuestionLabel>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div onClick={() => setBuyerIntent('Instant Estimate')} className={cn("p-4 border cursor-pointer transition-all rounded-xl", buyerIntent === 'Instant Estimate' ? "border-[#ec028b] bg-[#ec028b]/10 text-[#ec028b]" : "border-gray-800 bg-black/20 hover:border-gray-600 text-white")}>
                                                    <p className="font-black text-xs uppercase">Need A Ballpark Price</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">Route: Instant Estimate</p>
                                                </div>
                                                <div onClick={() => setBuyerIntent('Certified Quote')} className={cn("p-4 border cursor-pointer transition-all rounded-xl", buyerIntent === 'Certified Quote' ? "border-[#ec028b] bg-[#ec028b]/10 text-[#ec028b]" : "border-gray-800 bg-black/20 hover:border-gray-600 text-white")}>
                                                    <p className="font-black text-xs uppercase">Need A Firm Quote</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">Route: Certified Quote</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </CardContent>
                </Card>

                {/* 6. INTAKE MODULES */}
                {(buyerIntent === 'Instant Estimate' || buyerIntent === 'Certified Quote') && (
                    <div className="space-y-6 animate-fade-in">

                        <Card className="shadow-2xl">
                            <CardContent className="p-8 space-y-8">
                                <SectionHeader title={buyerIntent === 'Instant Estimate' ? "Estimate Data Collection" : "Roof Analysis & Access"} icon={MapIcon} />
                                
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-gray-800 h-24 rounded-lg flex items-end p-2 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-cover bg-center opacity-50 blur-[2px]" style={{ backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=20&size=400x400&maptype=satellite&key=YOUR_API_KEY")' }} />
                                        <span className="relative z-10 bg-black/60 px-2 py-1 rounded text-[9px] font-bold text-white flex items-center gap-1"><MapIcon className="w-3 h-3"/> 2D Satellite</span>
                                    </div>
                                    <div className="bg-gray-800 h-24 rounded-lg flex items-end p-2 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-cover bg-center opacity-50 blur-[2px]" style={{ backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=20&size=400x400&maptype=satellite&heading=90&tilt=45&key=YOUR_API_KEY")' }} />
                                        <span className="relative z-10 bg-black/60 px-2 py-1 rounded text-[9px] font-bold text-white flex items-center gap-1"><MapIcon className="w-3 h-3"/> 3D Earth</span>
                                    </div>
                                    <div className="bg-gray-800 h-24 rounded-lg flex items-end p-2 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-cover bg-center opacity-30" />
                                        <span className="relative z-10 bg-black/60 px-2 py-1 rounded text-[9px] font-bold text-white flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> Street View</span>
                                    </div>
                                </div>

                                <div className="p-6 border border-gray-800 bg-black/20 rounded-xl">
                                    <QuestionLabel>How many existing layers?</QuestionLabel>
                                    <ToggleGroup options={['1', '2', '3', '4+']} value={intakeData.layers} onChange={v => handleIntakeChange('layers', v)} />
                                </div>

                                {buyerIntent === 'Certified Quote' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <QuestionLabel>Access Type</QuestionLabel>
                                                <ToggleGroup options={['Ladder', 'Roof Hatch', 'Drone']} value={intakeData.accessType} onChange={v => handleIntakeChange('accessType', v)} />
                                            </div>
                                            <div>
                                                <QuestionLabel>Ladders Required</QuestionLabel>
                                                <div className="flex flex-col gap-2">
                                                    {['18\\' Little Giant', '28\\' HyperLite', '32\\' HyperLite', '40\\' Aluminum'].map(ladder => {
                                                        const isSel = intakeData.laddersRequired.includes(ladder);
                                                        return (
                                                            <button 
                                                                key={ladder} type="button" 
                                                                onClick={() => {
                                                                    handleIntakeChange('laddersRequired', isSel ? intakeData.laddersRequired.filter(l => l !== ladder) : [...intakeData.laddersRequired, ladder]);
                                                                }}
                                                                className={cn("w-full py-3 px-4 border text-[11px] font-black uppercase tracking-widest transition-all rounded-lg text-left", isSel ? "bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/50" : "bg-black/40 text-gray-500 border-gray-800 hover:border-gray-600")}
                                                            >{ladder}</button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="h-full border border-gray-800 bg-black/40 rounded-xl p-6">
                                                <h4 className="text-[#ec028b] font-black text-[10px] uppercase tracking-widest mb-4">SOLAR INTELLIGENCE DATA</h4>
                                                <div className="flex justify-between border-b border-gray-800 pb-2 mb-2"><span className="text-gray-400 text-xs">Total SQ</span><span className="text-white font-bold text-xs">25.78</span></div>
                                                <div className="flex justify-between border-b border-gray-800 pb-2 mb-2"><span className="text-gray-400 text-xs">Total Facets</span><span className="text-white font-bold text-xs">6</span></div>
                                                <div className="flex justify-between border-b border-gray-800 pb-4 mb-4"><span className="text-gray-400 text-xs">Dominant Pitch</span><span className="text-white font-bold text-xs">5/12</span></div>
                                                <div className="flex justify-between mb-1"><span className="text-gray-500 text-[10px]">4/12 Pitch</span><span className="text-gray-400 text-[10px]">4.25 SQ</span></div>
                                                <div className="flex justify-between mb-1"><span className="text-gray-500 text-[10px]">5/12 Pitch</span><span className="text-gray-400 text-[10px]">10.76 SQ</span></div>
                                                <div className="flex justify-between mb-1"><span className="text-gray-500 text-[10px]">8/12 Pitch</span><span className="text-gray-400 text-[10px]">10.76 SQ</span></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {buyerIntent === 'Instant Estimate' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <QuestionLabel>Chimneys</QuestionLabel>
                                            <ToggleGroup options={['0', '1', '2', '3', '4+']} value={intakeData.chimneys} onChange={v => handleIntakeChange('chimneys', v)} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }} />
                                        </div>
                                        <div>
                                            <QuestionLabel>Skylights</QuestionLabel>
                                            <ToggleGroup options={['0', '1', '2', '3', '4+']} value={intakeData.skylights} onChange={v => handleIntakeChange('skylights', v)} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }} />
                                        </div>
                                        <div>
                                            <QuestionLabel>Swamp Coolers</QuestionLabel>
                                            <ToggleGroup options={['0', '1', '2', '3', '4+']} value={intakeData.swampCoolers} onChange={v => handleIntakeChange('swampCoolers', v)} style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }} />
                                        </div>

                                        {/* Gutter Details */}
                                        <div className="col-span-1 md:col-span-3 border border-gray-800 rounded-xl p-6 mt-4">
                                            <h4 className="text-white font-black text-[13px] uppercase tracking-widest flex items-center mb-6"><GutterIcon className="w-5 h-5 mr-3" /> Gutter Details</h4>
                                            
                                            <QuestionLabel>About how many feet of gutters are on your project?</QuestionLabel>
                                            <div className="flex gap-2 mb-6">
                                                <input type="text" className="w-full bg-black/40 border border-gray-800 text-white rounded-lg px-4" value={intakeData.gutterFeet} onChange={e => handleIntakeChange('gutterFeet', e.target.value)} />
                                                <button type="button" className="px-6 border border-gray-700 bg-gray-800 text-white text-[11px] font-bold uppercase rounded-lg">Measure</button>
                                            </div>

                                            <div className="h-32 bg-gray-800 rounded-lg flex items-end p-4 mb-6 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80")' }} />
                                                <span className="relative z-10 bg-black/60 px-3 py-1.5 rounded text-[10px] font-bold text-white uppercase tracking-widest">Standard Residential Gutter System</span>
                                            </div>

                                            <QuestionLabel>How many miters (gutter corners) are on your project?</QuestionLabel>
                                            <input type="text" className="w-full bg-black/40 border border-gray-800 text-white rounded-lg px-4 py-3 mb-6" value={intakeData.gutterMiters} onChange={e => handleIntakeChange('gutterMiters', e.target.value)} />

                                            <QuestionLabel>How many downspouts does your property currently have?</QuestionLabel>
                                            <div className="grid grid-cols-4 gap-4">
                                                {['1-Story', '2-Story', '3-Story', '4-Story'].map(story => (
                                                    <div key={story}>
                                                        <span className="text-[10px] text-gray-500 uppercase block mb-1 text-center font-bold">{story}</span>
                                                        <input type="text" className="w-full bg-black/40 border border-gray-800 text-white rounded-lg px-4 py-2 text-center" value={intakeData.gutterDownspouts[story]} onChange={e => handleIntakeChange('gutterDownspouts', {...intakeData.gutterDownspouts, [story]: e.target.value})} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Heat Trace Details */}
                                        <div className="col-span-1 md:col-span-3 border border-gray-800 rounded-xl p-6">
                                            <h4 className="text-white font-black text-[13px] uppercase tracking-widest flex items-center mb-6"><BoltIcon className="w-5 h-5 mr-3" /> Heat Trace Details</h4>
                                            
                                            <QuestionLabel>What's the total length (in feet) of the area you'd like heat trace installed on?</QuestionLabel>
                                            <div className="flex gap-2 mb-6">
                                                <input type="text" className="w-full bg-black/40 border border-gray-800 text-white rounded-lg px-4 placeholder:text-gray-600" placeholder="Ex: 85" value={intakeData.heatTraceLength} onChange={e => handleIntakeChange('heatTraceLength', e.target.value)} />
                                                <button type="button" className="px-6 border border-gray-700 bg-gray-800 text-white text-[11px] font-bold uppercase rounded-lg">Measure</button>
                                            </div>

                                            <QuestionLabel>How many downspouts would you like heat cable added to?</QuestionLabel>
                                            <div className="grid grid-cols-4 gap-4 mb-6">
                                                {['1-Story', '2-Story', '3-Story', '4-Story'].map(story => (
                                                    <div key={`ht-${story}`}>
                                                        <span className="text-[10px] text-gray-500 uppercase block mb-1 text-center font-bold">{story}</span>
                                                        <input type="text" className="w-full bg-black/40 border border-gray-800 text-white rounded-lg px-4 py-2 text-center" value={intakeData.heatTraceDownspouts[story]} onChange={e => handleIntakeChange('heatTraceDownspouts', {...intakeData.heatTraceDownspouts, [story]: e.target.value})} />
                                                    </div>
                                                ))}
                                            </div>

                                            <QuestionLabel>Which eave overhang looks most like your home?</QuestionLabel>
                                            <div className="grid grid-cols-4 gap-4">
                                                {['None', 'Small', 'Medium', 'Large'].map(type => {
                                                    const isSelected = intakeData.heatTraceOverhang === type;
                                                    return (
                                                        <div key={type} onClick={() => handleIntakeChange('heatTraceOverhang', type)} className={cn("h-24 bg-gray-800 rounded-lg flex items-end justify-center pb-2 cursor-pointer transition-all border-2", isSelected ? "border-[#ec028b]" : "border-transparent hover:border-gray-600")}>
                                                            <span className="text-[12px] font-black text-white px-2 uppercase shadow-black drop-shadow-md">{type}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                    </div>
                                )}
                                
                                <div className="flex justify-end pt-4"><Button size="sm">Confirm Analysis</Button></div>
                            </CardContent>
                        </Card>

                        {buyerIntent === 'Certified Quote' && (
                            <>
                                <Card className="shadow-2xl">
                                    <CardContent className="p-8 space-y-8">
                                        <SectionHeader title="Detailed Scope" icon={ListBulletIcon} />
                                        
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="col-span-2">
                                                <QuestionLabel>Roof Material Considering</QuestionLabel>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['Asphalt Shingles', 'Metal', 'Tile', 'TPO/Membrane', 'Wood Shake'].map(mat => (
                                                        <button key={mat} type="button" onClick={() => handleIntakeChange('roofMaterial', mat)} className={cn("py-3 text-[11px] font-black tracking-widest uppercase border rounded-lg transition-all", intakeData.roofMaterial === mat ? "bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/50" : "bg-black/40 border-gray-800 text-gray-500 hover:text-white")} style={mat === 'Asphalt Shingles' ? { gridColumn: 'span 1' } : {}}>{mat}</button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="col-span-2">
                                                <QuestionLabel>Decking / Wood Replacement</QuestionLabel>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['N/A - No Decking', 'Replace Damaged', 'Wet Rot'].map(deck => (
                                                        <button key={deck} type="button" onClick={() => handleIntakeChange('decking', deck)} className={cn("py-3 text-[11px] font-black tracking-widest uppercase border rounded-lg transition-all", intakeData.decking === deck ? "bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/50" : "bg-black/40 border-gray-800 text-gray-500 hover:text-white")} style={deck==='Wet Rot' ? { gridColumn: '1 / span 1'} : {}}>{deck}</button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <QuestionLabel>Satellite Dish</QuestionLabel>
                                                <select className="w-full bg-black/40 border border-gray-800 text-gray-300 rounded-lg px-4 py-3 text-xs uppercase font-bold" value={intakeData.satelliteDish} onChange={e => handleIntakeChange('satelliteDish', e.target.value)}>
                                                    <option>N/A</option>
                                                    <option>RE-INSTALL EXISTING</option>
                                                </select>
                                            </div>
                                            <div>
                                                <QuestionLabel>Swamp Cooler</QuestionLabel>
                                                <select className="w-full bg-black/40 border border-gray-800 text-gray-300 rounded-lg px-4 py-3 text-xs uppercase font-bold" value={intakeData.swampCoolerDropdown} onChange={e => handleIntakeChange('swampCoolerDropdown', e.target.value)}>
                                                    <option>N/A</option>
                                                    <option>REMOVE & DISCARD</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <QuestionLabel>Solar Panels</QuestionLabel>
                                                <select className="w-full bg-black/40 border border-gray-800 text-gray-300 rounded-lg px-4 py-3 text-xs uppercase font-bold" value={intakeData.solarPanelsDropdown} onChange={e => handleIntakeChange('solarPanelsDropdown', e.target.value)}>
                                                    <option>N/A - No Solar</option>
                                                    <option>REMOVE AND REINSTALL</option>
                                                </select>
                                            </div>

                                            <div className="col-span-2">
                                                <QuestionLabel>Additional Structures</QuestionLabel>
                                                <input type="text" className="w-full bg-black/40 border border-gray-800 text-gray-400 rounded-lg px-4 py-3 text-sm" placeholder="Note details here..." value={intakeData.additionalStructures} onChange={e => handleIntakeChange('additionalStructures', e.target.value)} />
                                            </div>
                                            
                                            <div className="col-span-2">
                                                <div className="flex justify-between items-center mb-2">
                                                    <QuestionLabel className="mb-0">Project Details</QuestionLabel>
                                                    <span className="text-[9px] font-black text-[#ec028b] uppercase tracking-widest flex items-center gap-1"><SparklesIcon className="w-3 h-3"/> Optimize Notes</span>
                                                </div>
                                                <textarea className="w-full h-32 bg-black/40 border border-gray-800 text-white rounded-lg p-4 text-sm" placeholder="Enter rough notes here..." value={intakeData.projectDetails} onChange={e => handleIntakeChange('projectDetails', e.target.value)} />
                                            </div>

                                            <div className="col-span-2">
                                                <QuestionLabel>Upload Blueprints / Specs</QuestionLabel>
                                                <div className="h-32 border border-gray-800 border-dashed rounded-xl bg-black/20 flex flex-col justify-center items-center text-gray-500 cursor-pointer hover:border-gray-500 hover:text-white transition-all">
                                                    <CloudArrowUpIcon className="w-8 h-8 mb-2" />
                                                    <span className="text-[10px] uppercase font-bold tracking-widest">Drag & Drop or Click to Upload</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4"><Button size="sm">Next</Button></div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-2xl">
                                    <CardContent className="p-8 space-y-8">
                                        <SectionHeader title="Customer Profile" icon={UserIcon} />
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <QuestionLabel>Main Concerns</QuestionLabel>
                                                <div className="flex flex-col gap-3">
                                                    {['Longevity', 'Curb Appeal', 'Disruption', 'Budget', 'Warranty'].map(concern => {
                                                        const isSel = intakeData.mainConcerns.includes(concern);
                                                        return (
                                                            <button 
                                                                key={concern} type="button" 
                                                                onClick={() => handleIntakeChange('mainConcerns', isSel ? intakeData.mainConcerns.filter(c => c !== concern) : [...intakeData.mainConcerns, concern])}
                                                                className={cn("w-full py-3 px-4 border text-[11px] font-black uppercase tracking-widest transition-all rounded-lg text-center", isSel ? "bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/50" : "bg-black/40 text-gray-500 border-gray-800 hover:text-white hover:border-gray-600")}
                                                            >{concern}</button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div>
                                                <QuestionLabel>Decision Process</QuestionLabel>
                                                <div className="flex flex-col gap-3">
                                                    {['Need Tech Specs', 'Want Examples', 'Compare Options', 'Trust Expert'].map(proc => {
                                                        const isSel = intakeData.decisionProcess.includes(proc);
                                                        return (
                                                            <button 
                                                                key={proc} type="button" 
                                                                onClick={() => handleIntakeChange('decisionProcess', isSel ? intakeData.decisionProcess.filter(p => p !== proc) : [...intakeData.decisionProcess, proc])}
                                                                className={cn("w-full py-3 px-4 border text-[11px] font-black uppercase tracking-widest transition-all rounded-lg text-center", isSel ? "bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/50" : "bg-black/40 text-gray-500 border-gray-800 hover:text-white hover:border-gray-600")}
                                                            >{proc}</button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <QuestionLabel>Familiarity</QuestionLabel>
                                                    <select className="w-full bg-black/40 border border-gray-800 text-white rounded-lg px-4 py-3 text-xs uppercase font-bold" value={intakeData.familiarity} onChange={e => handleIntakeChange('familiarity', e.target.value)}>
                                                        <option>Homeowner (Beginner)</option>
                                                        <option>Experienced Buyer</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <QuestionLabel>Investment Style</QuestionLabel>
                                                    <select className="w-full bg-black/40 border border-gray-800 text-white rounded-lg px-4 py-3 text-xs uppercase font-bold" value={intakeData.investmentStyle} onChange={e => handleIntakeChange('investmentStyle', e.target.value)}>
                                                        <option>Value Driven</option>
                                                        <option>Premium Quality</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <QuestionLabel>Readiness to Start</QuestionLabel>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['Immediately', 'ASAP (if aligned)', 'Need to Consult', 'Researching'].map(rt => {
                                                        const isSel = intakeData.readinessToStart === rt;
                                                        return (
                                                            <button 
                                                                key={rt} type="button" 
                                                                onClick={() => handleIntakeChange('readinessToStart', rt)}
                                                                className={cn("w-full py-3 px-4 border text-[11px] font-black uppercase tracking-widest transition-all rounded-lg text-center", isSel ? "bg-[#ec028b]/20 text-[#ec028b] border-[#ec028b]/50" : "bg-black/40 text-gray-500 border-gray-800 hover:text-white hover:border-gray-600")}
                                                            >{rt}</button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4"><Button size="sm">Finish Profile</Button></div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                )}

                {/* 7. FINAL ACTION HUB */}
                <Card className="border-gray-800/80 shadow-2xl animate-fade-in mt-12 overflow-hidden bg-black/30 backdrop-blur-lg">
                    <CardContent className="p-10 flex flex-col items-start gap-8">
                        <div className="w-full flex items-center gap-4 mb-2">
                            <FingerPrintIcon className="w-5 h-5 text-[#ec028b]" />
                            <h3 className="text-white font-black text-lg uppercase tracking-widest">Customer Profile Summary</h3>
                        </div>
                        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 p-6 border border-gray-800 bg-black/40 shadow-inner" style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}>
                            <div><p className="text-[9px] text-gray-500 font-black uppercase mb-1">Target Address</p><p className="text-white text-xs font-bold">{propertyData.address || 'Pending'}</p></div>
                            <div><p className="text-[9px] text-gray-500 font-black uppercase mb-1">Primary Contact</p><p className="text-white text-xs font-bold">{contacts.find(c=>c.isPrimary)?.firstName || 'Pending'} {contacts.find(c=>c.isPrimary)?.lastName}</p></div>
                            <div><p className="text-[9px] text-gray-500 font-black uppercase mb-1">Project Category</p><p className="text-[#ec028b] text-xs font-bold uppercase">{projectCategory}</p></div>
                            <div><p className="text-[9px] text-gray-500 font-black uppercase mb-1">Intake Route</p><p className="text-[#00D1FF] text-xs font-bold uppercase">{buyerIntent || 'Pending Calculation'}</p></div>
                        </div>
                        
                        <div className="flex w-full justify-between items-center pt-4">
                            <Button variant="secondary" size="lg" onClick={() => setActivePageId('P-01')}>Cancel</Button>
                            <Button size="lg" type="submit" className={cn("shadow-2xl border transition-all duration-500", buyerIntent ? "border-[#ec028b]/50 bg-[#ec028b]/20 text-white hover:bg-[#ec028b]/40" : "border-white/20 bg-white/10 text-white/50")} disabled={!buyerIntent}>Input Project Request</Button>
                        </div>"""

    text = text[:start_idx] + new_ui + text[end_idx:]

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(text)

print("Update completed.")
