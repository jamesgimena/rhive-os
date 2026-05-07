import json
import re
import os
import shutil

src_folder = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\1d7f8dd5-8f60-47e7-89bb-e1489e00eab0\\'
public_folder = 'public/components/'

os.makedirs(public_folder, exist_ok=True)
images_to_copy = {
    'chimney': 'real_chimney_1773772853903.png',
    'gutter': 'real_seamless_gutter_1773772866806.png',
    'flat_roof': 'real_flat_roof_1773772880426.png',
    'emergency': 'real_proarmor_tarp_1773772841457.png',
    'skylight': 'real_skylight_1773772893598.png'
}

for key, img in images_to_copy.items():
    src_path = os.path.join(src_folder, img)
    if os.path.exists(src_path):
        shutil.copy(src_path, os.path.join(public_folder, img))

with open('data/services_formatted_clean.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

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

def sanitize(s):
    return str(s).replace('\\"', '\\\\"').replace('"', '\\"').replace('\n', ' ').replace('\\n', ' ')

for cat, items in data.items():
    if cat == 'Chimney Detail':
        cat = 'Chimney'
    elif cat == 'Heat Trace':
        cat = 'Ice Management'
        
    for i, item in enumerate(items):
        title = item['title']
        id_str = title.lower().replace(' ', '-').replace('/', '-').replace('"', '').replace('”', '').replace('®', '')
        id_str = re.sub(r'[^a-z0-9-]', '', id_str)
        # Parse description
        desc_full = item['description']
        
        main_desc = []
        guarantee_inst = 'Standard Guarantee applies.'
        guarantee_mat = 'Standard Warranty applies.'
        blueprint = []
        standard = 'RHIVE Standard'
        
        mode = 'desc'
        lines = []
        for line1 in desc_full.split('\n'):
            for line2 in line1.split('\\n'):
                lines.append(line2)

        for line in lines:
            line = line.strip()
            if 'INSTALLATION WARRANTY:' in line:
                guarantee_inst = line.split('INSTALLATION WARRANTY:')[1].strip()
                continue
            if 'MATERIALS WARRANTY:' in line:
                guarantee_mat = line.split('MATERIALS WARRANTY:')[1].strip()
                continue
            
            if 'EXECUTION BLUEPRINT' in line or 'Execution Blueprint' in line or 'The RHIVE' in line or 'System Details &' in line or 'Execution &' in line:
                mode = 'blueprint'
                continue
                
            if mode == 'desc' and line and 'RHIVE CORE COMMITMENT' not in line:
                main_desc.append(line)
            elif mode == 'blueprint' and line and 'RHIVE QUALITY STANDARD' not in line and 'NOTE ON SUBSTITUTIONS' not in line:
                blueprint.append(line)

        description_text = ' '.join(main_desc) if main_desc else desc_full
        
        # Image matching logic
        upper_title = title.upper()
        image_path = ''
        if 'CHIMNEY' in upper_title:
            image_path = f'/components/{images_to_copy["chimney"]}'
        elif 'GUTTER' in upper_title:
            image_path = f'/components/{images_to_copy["gutter"]}'
        elif 'VELUX' in upper_title or 'SKYLIGHT' in upper_title or 'SUN TUNNEL' in upper_title:
            image_path = f'/components/{images_to_copy["skylight"]}'
        elif 'EMERGENCY' in upper_title:
            image_path = f'/components/{images_to_copy["emergency"]}'
        elif 'MAINTENANCE' in cat.upper() or 'ROOF DEBRIS' in upper_title or 'MEMBRANE' in upper_title or 'COPING' in upper_title:
            image_path = f'/components/{images_to_copy["flat_roof"]}'
        elif 'REPAIR' in cat.upper():
            image_path = f'/components/{images_to_copy["flat_roof"]}' # fallback
            
        output += f'    {{\n'
        output += f'        id: "{id_str}",\n'
        output += f'        title: "{sanitize(title)}",\n'
        output += f'        category: "{sanitize(cat)}",\n'
        output += f'        description: "{sanitize(description_text).strip()}",\n'
        if image_path:
            output += f'        image: "{image_path}",\n'
        output += f'        guarantee: {{\n'
        output += f'            installation: "{sanitize(guarantee_inst)}",\n'
        output += f'            materials: "{sanitize(guarantee_mat)}"\n'
        output += f'        }},\n'
        output += f'        blueprint: [\n'
        for bp in blueprint:
            if bp:
                output += f'            "{sanitize(bp)}",\n'
        
        if not blueprint:
            output += f'            "Standard Execution"\n'
            
        output += f'        ],\n'
        output += f'        standard: "RHIVE Quality Standard"\n'
        output += f'    }},\n'

output += '];\n'

with open('data/roofComponentsData.ts', 'w', encoding='utf-8') as f:
    f.write(output)

print('Generated new roofComponentsData.ts with images.')
