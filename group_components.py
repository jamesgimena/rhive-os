import json
import re

with open('data/services_formatted_clean.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Images map (Updated with all latest hyper-realistic AI generations)
images_to_copy = {
    'chimney': 'real_chimney_1773772853903.png',
    'gutter': 'real_seamless_gutter_1773772866806.png',
    'flat_roof': 'real_flat_roof_1773772880426.png',
    'emergency': 'proarmor_tarp_realistic_1773797399505.png',
    'skylight': 'real_skylight_1773772893598.png',
    'heat_trace': 'heat_trace_1773773528589.png',
    'coping_cap': 'coping_cap_1773773544079.png',
    'solar_panel': 'solar_panel_1773773558067.png',
    'vegetation': 'vegetation_management_1773773572347.png',
    'pipe_flashing': 'pipe_flashing_1773773586963.png',
    'bird_deterrent': 'bird_deterrent_1773773610480.png',
    'roof_debris': 'roof_debris_1773773622853.png',
    'shingle_repair': 'shingle_repair_1773773637407.png'
}

def sanitize(s):
    return str(s).replace('\\"', '\\\\"').replace('"', '\\"').replace('\n', ' ').replace('\\n', ' ')

def extract_guarantee(desc):
    guarantee_inst = 'Standard Guarantee applies.'
    guarantee_mat = 'Standard Warranty applies.'
    lines = []
    for line1 in desc.split('\n'):
        for line2 in line1.split('\\n'):
            lines.append(line2.strip())
            
    for line in lines:
        if 'INSTALLATION WARRANTY:' in line:
            guarantee_inst = line.split('INSTALLATION WARRANTY:')[1].strip()
        if 'MATERIALS WARRANTY:' in line:
            guarantee_mat = line.split('MATERIALS WARRANTY:')[1].strip()
    return guarantee_inst, guarantee_mat

def extract_blueprint(desc):
    blueprint = []
    mode = 'desc'
    lines = []
    for line1 in desc.split('\n'):
        for line2 in line1.split('\\n'):
            lines.append(line2.strip())
            
    for line in lines:
        if 'EXECUTION BLUEPRINT' in line or 'Execution Blueprint' in line or 'The RHIVE' in line or 'System Details &' in line or 'Execution &' in line:
            mode = 'blueprint'
            continue
        if mode == 'blueprint' and line and 'RHIVE QUALITY STANDARD' not in line and 'NOTE ON SUBSTITUTIONS' not in line:
            if 'MATERIALS WARRANTY:' in line or 'INSTALLATION WARRANTY:' in line:
                continue
            blueprint.append(line)
    return blueprint

def extract_main_desc(desc):
    main_desc = []
    mode = 'desc'
    lines = []
    for line1 in desc.split('\n'):
        for line2 in line1.split('\\n'):
            lines.append(line2.strip())
            
    for line in lines:
        if 'EXECUTION BLUEPRINT' in line or 'Execution Blueprint' in line or 'The RHIVE' in line or 'System Details &' in line or 'Execution &' in line:
            mode = 'blueprint'
            continue
        if 'INSTALLATION WARRANTY:' in line or 'MATERIALS WARRANTY:' in line:
            continue
        if 'RHIVE CORE COMMITMENT' in line:
            continue
            
        if mode == 'desc' and line:
            main_desc.append(line)
            
    return ' '.join(main_desc) if main_desc else desc

groups = []

# --- SMART GROUPING ---
# 1. GUTTERS (Consolidating K-Style, Round, Box into one main component card)
gutter_desc = extract_main_desc(data['Gutters'][0]['description']) # Base off K-style
gutter_blueprint = extract_blueprint(data['Gutters'][0]['description']) # Base off K-style
groups.append({
    'title': 'ARCHITECTURAL SEAMLESS GUTTER SYSTEMS',
    'category': 'Gutters',
    'image': f'/components/{images_to_copy["gutter"]}',
    'description': "Complete water management systems engineered to exact architectural specifications. Featuring flawless seamless execution in K-Style, Round, and Box profiles, manufactured instantly on-site.",
    'guarantee': ('10-Year Craftsmanship Warranty', '20-Year Manufacturer Finish'),
    'blueprint': ['System Calibrations: Roll-formed directly onto property boundaries.', 'Hardware Security: Hidden industrial bracket mounting.', 'Pitch Optimization: Precise geometric grade fall calculation.', 'System Flashing: Fully integrated drip-edge interface.'],
    'options': [
        '5-Inch Modern K-Style (Residential)', 
        '6-Inch Commercial K-Style', 
        '5-Inch Designer Half-Round', 
        '6-Inch Half-Round Max Flow', 
        '5-Inch Minimalist Box Profile', 
        '6-Inch Commercial Box'
    ],
    'optionDescriptions': {
        '5-Inch Modern K-Style (Residential)': extract_main_desc(data['Gutters'][0]['description']),
        '6-Inch Commercial K-Style': extract_main_desc(data['Gutters'][1]['description']),
        '5-Inch Designer Half-Round': extract_main_desc(data['Gutters'][2]['description']),
        '6-Inch Half-Round Max Flow': extract_main_desc(data['Gutters'][3]['description']),
        '5-Inch Minimalist Box Profile': extract_main_desc(data['Gutters'][4]['description']),
        '6-Inch Commercial Box': extract_main_desc(data['Gutters'][5]['description'])
    }
})

# 2. ICE MANAGEMENT
# Heat trace is 1 item, so we keep it.
groups.append({
    'title': data['Heat Trace'][0]['title'],
    'category': 'Ice Management',
    'image': f'/components/{images_to_copy["heat_trace"]}',
    'description': extract_main_desc(data['Heat Trace'][0]['description']),
    'guarantee': extract_guarantee(data['Heat Trace'][0]['description']),
    'blueprint': extract_blueprint(data['Heat Trace'][0]['description']),
})

# 3. ROOF DETAILS
# VELUX
velux_guar = extract_guarantee(data['Roof Detail'][1]['description'])
groups.append({
    'title': 'VELUX® DAYLIGHT SKYLIGHT SYSTEMS',
    'category': 'Roof Details',
    'image': f'/components/{images_to_copy["skylight"]}',
    'description': "Complete integration of energy-efficient Velux® skylights or sun tunnels. We ensure perfect thermal sealing and watertight execution.",
    'guarantee': velux_guar,
    'blueprint': ['System Detach: Safe removal of existing lighting unit.', 'Flashing Integration: Three-layer stepped flashing system.', 'Unit placement: High-impact resistant daylight system mount.', 'Final Weatherproofing: Permanent thermal and moisture barrier.'],
    'options': ['Fixed Curb-Mounted Skylight', 'Sun Tunnel® Complete Integration'],
    'optionDescriptions': {
        'Fixed Curb-Mounted Skylight': extract_main_desc(data['Roof Detail'][2]['description']),
        'Sun Tunnel® Complete Integration': extract_main_desc(data['Roof Detail'][1]['description'])
    }
})

# COPING CAP
groups.append({
    'title': 'ARCHITECTURAL METAL COPING SERVICES',
    'category': 'Roof Details',
    'image': f'/components/{images_to_copy["coping_cap"]}',
    'description': "Precision flat roof parapet wall protection. We manage metal coping systems engineered to exceed the strictest high-wind manufacturer requirements.",
    'guarantee': extract_guarantee(data['Roof Detail'][3]['description']),
    'blueprint': extract_blueprint(data['Roof Detail'][5]['description']),
    'options': ['Complete New Installation', 'Detach & Precision Reset', 'Remove & Custom Replace'],
    'optionDescriptions': {
        'Complete New Installation': extract_main_desc(data['Roof Detail'][5]['description']),
        'Detach & Precision Reset': extract_main_desc(data['Roof Detail'][4]['description']),
        'Remove & Custom Replace': extract_main_desc(data['Roof Detail'][3]['description'])
    }
})

# SOLAR
solar_bp = ['System De-energization: Mandatory safety disconnect by certified electrician.', 'Array Detachment & Storing: Safe systematic array removal.', 'Reinstallation: Array resetting and precise recalibration.', 'Network Re-energization: Full electrical and load testing.']
groups.append({
    'title': 'SOLAR PANEL MANAGEMENT PROTOCOL',
    'category': 'Roof Details',
    'image': f'/components/{images_to_copy["solar_panel"]}',
    'description': "Comprehensive coordination for solar panel systems during roof replacement, including safe detachment, storage, resetting, and panel cleaning.",
    'guarantee': ('Service execution warranty applies.', 'Original solar system warranty maintained.'),
    'blueprint': solar_bp,
    'options': ['Complete Detach & Reset', 'System Cancellation / Retirement', 'Solar Array Expert Cleaning', 'Off-Site Conditioned Storage', 'Electrical Reconnection Protocol'],
    'optionDescriptions': {
        'Complete Detach & Reset': extract_main_desc(data['Roof Detail'][6]['description']),
        'System Cancellation / Retirement': extract_main_desc(data['Roof Detail'][7]['description']),
        'Solar Array Expert Cleaning': extract_main_desc(data['Roof Detail'][8]['description']),
        'Off-Site Conditioned Storage': extract_main_desc(data['Roof Detail'][9]['description']),
        'Electrical Reconnection Protocol': extract_main_desc(data['Roof Detail'][10]['description'])
    }
})

# VEG
groups.append({
    'title': data['Roof Detail'][0]['title'],
    'category': 'Roof Details',
    'image': f'/components/{images_to_copy["vegetation"]}',
    'description': extract_main_desc(data['Roof Detail'][0]['description']),
    'guarantee': extract_guarantee(data['Roof Detail'][0]['description']),
    'blueprint': extract_blueprint(data['Roof Detail'][0]['description']),
})

# 4. MAINTENANCE (Grouped smartly into 2 main modules)
main_desc_maint_debris = extract_main_desc(data['Maintenance'][0]['description'])
main_desc_maint_roof = extract_main_desc(data['Maintenance'][3]['description'])
groups.append({
    'title': 'PROACTIVE SURFACE & DRAIN DEBRIS',
    'category': 'Maintenance',
    'image': f'/components/{images_to_copy["roof_debris"]}',
    'description': "Critical removal of bio-matter, leaves, and granular breakdown. Ensuring absolute unhindered water dispersal from roof plane to foundation outlet.",
    'guarantee': ('Complete Flow Guarantee', 'Surface Scrape Prevention Limit'),
    'blueprint': extract_blueprint(data['Maintenance'][3]['description']),
    'options': ['Roof Surface Debris Abatement', 'Gutter & Downspout System Flush'],
    'optionDescriptions': {
        'Roof Surface Debris Abatement': main_desc_maint_roof,
        'Gutter & Downspout System Flush': main_desc_maint_debris
    }
})

main_desc_pipe = extract_main_desc(data['Maintenance'][1]['description'])
main_desc_bird = extract_main_desc(data['Maintenance'][2]['description'])
groups.append({
    'title': 'PERIPHERAL COMPONENT PROTECTION',
    'category': 'Maintenance',
    'image': f'/components/{images_to_copy["bird_deterrent"]}',
    'description': "Targeted defense upgrades and seal maintenance for isolated vertical penetrations and high-risk zones, protecting against thermal shifts and local wildlife.",
    'guarantee': extract_guarantee(data['Maintenance'][1]['description']),
    'blueprint': extract_blueprint(data['Maintenance'][1]['description']),
    'options': ['Pipe Flashing Ge-Cell Reseal', 'Avian / Bird Deterrent Installation'],
    'optionDescriptions': {
        'Pipe Flashing Ge-Cell Reseal': main_desc_pipe,
        'Avian / Bird Deterrent Installation': main_desc_bird
    }
})

# 5. REPAIR (Combining into larger grouped cards)
groups.append({
    'title': 'TARGETED SYSTEM PENETRATION REPAIRS',
    'category': 'Repair',
    'image': f'/components/{images_to_copy["shingle_repair"]}',
    'description': "Surgical extraction and superior replacement of localized failed components. Ensures an airtight, watertight geometric seal around high-risk penetrations and storm-damaged fields.",
    'guarantee': extract_guarantee(data['Repair'][1]['description']),
    'blueprint': extract_blueprint(data['Repair'][1]['description']),
    'options': ['Shingle Field Repair & Integration', 'Pipe Flashing Penetration Replacement'],
    'optionDescriptions': {
        'Shingle Field Repair & Integration': extract_main_desc(data['Repair'][1]['description']),
        'Pipe Flashing Penetration Replacement': extract_main_desc(data['Repair'][0]['description'])
    }
})

groups.append({
    'title': 'RAPID-RESPONSE LEAK CONTAINMENT',
    'category': 'Repair',
    'image': f'/components/{images_to_copy["emergency"]}',
    'description': "Immediate emergency interventions utilizing premium synthetic underlayment or thermal fusion to halt water progression before secondary structural damage occurs.",
    'guarantee': extract_guarantee(data['Emergency Roofing'][0]['description']),
    'blueprint': extract_blueprint(data['Emergency Roofing'][0]['description']) + extract_blueprint(data['Emergency Roofing'][1]['description']),
    'options': ['Steep Slope: Synthetic ProArmor Tarping', 'Low Slope: Membrane Fusion Patch'],
    'optionDescriptions': {
        'Steep Slope: Synthetic ProArmor Tarping': extract_main_desc(data['Emergency Roofing'][0]['description']),
        'Low Slope: Membrane Fusion Patch': extract_main_desc(data['Emergency Roofing'][1]['description'])
    }
})

# 6. CHIMNEY (Combining into one major module per user request: "all chimney items are listed in the chimney section, understandable, simple")
groups.append({
    'title': 'COMPREHENSIVE CHIMNEY SYSTEM OVERHAUL',
    'category': 'Chimney',
    'image': f'/components/{images_to_copy["chimney"]}',
    'description': "Engineering-grade restoration for structural, metal, and decorative chimney components. Eliminating complex water entry vectors with absolute certainty.",
    'guarantee': extract_guarantee(data['Chimney Detail'][0]['description']),
    'blueprint': extract_blueprint(data['Chimney Detail'][0]['description']),
    'options': ['Masonry Brick Matrix Repointing', 'Chase Pan Custom Metal Replacement', 'Chase Pan High-Tech Edge Reseal', 'Full Decorative Shroud Replacement', 'Shroud Perimeter Flashing Reseal'],
    'optionDescriptions': {
        'Masonry Brick Matrix Repointing': extract_main_desc(data['Chimney Detail'][0]['description']),
        'Chase Pan Custom Metal Replacement': extract_main_desc(data['Chimney Detail'][2]['description']),
        'Chase Pan High-Tech Edge Reseal': extract_main_desc(data['Chimney Detail'][1]['description']),
        'Full Decorative Shroud Replacement': extract_main_desc(data['Chimney Detail'][4]['description']),
        'Shroud Perimeter Flashing Reseal': extract_main_desc(data['Chimney Detail'][3]['description'])
    }
})

output = '''export interface ComponentDetail {
    id: string;
    title: string;
    category: 'Gutters' | 'Ice Management' | 'Chimney' | 'Maintenance' | 'Repair' | 'Roof Details';
    description: string;
    guarantee: {
        installation: string;
        materials: string;
    };
    blueprint: string[];
    standard: string;
    options?: string[];
    optionDescriptions?: Record<string, string>;
    image?: string;
}

export const roofComponents: ComponentDetail[] = [
'''

for g in groups:
    title = g['title']
    cat = g['category']
    id_str = re.sub(r'[^a-z0-9-]', '', title.lower().replace(' ', '-').replace('/', '-'))
    
    desc_str = sanitize(g['description'])
    g_inst = sanitize(g['guarantee'][0]) if g['guarantee'][0] else 'Standard Guarantee applies.'
    g_mat = sanitize(g['guarantee'][1]) if g['guarantee'][1] else 'Standard Warranty applies.'
    
    output += f'    {{\n'
    output += f'        id: "{id_str}",\n'
    output += f'        title: "{sanitize(title)}",\n'
    output += f'        category: "{sanitize(cat)}",\n'
    output += f'        description: "{desc_str}",\n'
    output += f'        image: "{g.get("image", "")}",\n'
    output += f'        guarantee: {{\n'
    output += f'            installation: "{g_inst}",\n'
    output += f'            materials: "{g_mat}"\n'
    output += f'        }},\n'
    output += f'        blueprint: [\n'
    
    for bp in g.get('blueprint', []):
        if bp:
            output += f'            "{sanitize(bp)}",\n'
    
    if not g.get('blueprint'):
        output += f'            "Standard Execution"\n'
        
    output += f'        ],\n'
    output += f'        standard: "RHIVE Quality Standard",\n'
    
    if g.get('options'):
        output += f'        options: [\n'
        for opt in g['options']:
            output += f'            "{sanitize(opt)}",\n'
        output += f'        ],\n'
        output += f'        optionDescriptions: {{\n'
        for opt, opt_desc in g['optionDescriptions'].items():
            output += f'            "{sanitize(opt)}": "{sanitize(opt_desc)}",\n'
        output += f'        }}\n'
        
    output += f'    }},\n'

output += '];\n'

with open('data/roofComponentsData.ts', 'w', encoding='utf-8') as f:
    f.write(output)

print('Generated correctly grouped roofComponentsData.ts')
