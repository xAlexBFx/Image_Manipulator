from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image as PILImage
import os
from flask_cors import CORS
import json
from io import BytesIO
import base64
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the images directory
IMAGES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp')
os.makedirs(IMAGES_DIR, exist_ok=True)

# Helper function: Remove red filter
def set_color(im, color_amount, color):
    width, height = im.size
    pixels = list(im.getdata())
    if(color == "red"):
        new_pixels = [(color_amount, g, b) for r, g, b in pixels]
    if(color == "green"):
        new_pixels = [(r, color_amount, b) for r, g, b in pixels]
    if(color == "blue"):
        new_pixels = [(r, g, color_amount) for r, g, b in pixels]
    new_image = PILImage.new("RGB", (width, height))
    new_image.putdata(new_pixels)
    return new_image


def make2D(L, width):
    n_list = []
    group_list = []
    step = 0
    for li in range( len(L) ):
        group_list.append( L[li] )
        step += 1
        if( step == width ):
            n_list.append(group_list)
            group_list = []
            step = 0
    
    if(len(group_list) > 0): 
        n_list.append(group_list)
    return n_list

def flatten(L):
    # 2D list -> 1D list (each row in order)
    new_list = []
    for r in range(len(L)):
        for c in range(len(L[0])):
            new_list.append(L[r][c])
    
    return new_list


def insert(im, smallImage):
    width, height = im.size
    img_data = make2D(list(im.getdata()), width) 

    width_2, height_2 = smallImage.size
    img_2_data = make2D(list(smallImage.getdata()), width_2)

    result_data = []
    img_2_r = 0
    img_2_c = 0
    
    for r in range(height):
        img_2_c = 0
        if (r < height_2 and r):
            for c in range(width):
                if (c < width_2 ):
                    result_data.append(img_2_data[img_2_r][img_2_c])
                    img_2_c += 1
                else: 
                    result_data.append(img_data[r][c])
            img_2_r += 1 
        else:
            for c in range(width):
                result_data.append(img_data[r][c])
            
    im2 = PILImage.new("RGB", (width,height)) 
    im2.putdata(result_data)
    return im2

def rotate_single(img, steps):
    steps = max(1, min(steps, 3))
    pixels = img
    rotated_img = []
    starting = True
    # Using the given parameter steps to rotate n times 90 degrees clockwise.
    while steps > 0:
    # Rotates the 2d list 90 degrees clockwise
        for r in range(len(pixels)-1, -1, -1):
            t_row = []
            # Creates the temporary row, which will be added to rotated_img
            for c in range(len(pixels[0])):
                t_row.append(pixels[r][c])
            
            if (starting == True):
                # Sets the base structure of rotated_img
                for p in range(len(t_row)):
                    rotated_img.append([t_row[p]])
                starting = False
            else :
                # Just adds to the structure
                for p in range(len(t_row)):
                    rotated_img[p].append(t_row[p])
            
        if(steps-1 > 0):
            pixels = rotated_img
            rotated_img = []
            starting = True
            steps -= 1
        else:
            return rotated_img

# Gets one img, and inserts img_2 over img in the given position
# coordinates (row, column) or (y, x)
def insert_image(img, img_2, position): 
    # img is type Image to insert data
    width, height = img.size
    img_data = make2D(list(img.getdata()), width)
    
    # Takes a Image object or a 2d list
    if(type(img_2) == list):
        height_2 = len(img_2)
        width_2 = len(img_2[0])
        img_data_2 = img_2
    else:
        width_2, height_2 = img_2.size
        img_data_2 = make2D(list(img_2.getdata()), width_2)
    
    
    # Setting coordinates limits
    if (position[0] + height_2 > height): 
        position = ((height - height_2), position[1])
        
    if (position[1] + width_2 > width): 
        position = (position[0], (width - width_2))
    
    if (position[0] < 0): 
        position = (0, position[1])
        
    if (position[1] < 0): 
        position = (position[0], 0)
    
    result_data = []
    img_2_r = 0
    img_2_c = 0
    
    # Inserting data into result_data depending on the position
    for r in range(height):
        img_2_c = 0
        if (r >= position[0] and r < (position[0] + width_2)):
            for c in range(width):
                if (c >= position[1] and c < (position[1] + height_2)):
                    result_data.append(img_data_2[img_2_r][img_2_c])
                    img_2_c += 1
                else: 
                    result_data.append(img_data[r][c])
            img_2_r += 1 
        else:
            for c in range(width):
                result_data.append(img_data[r][c])
    if(type(img_2) == list):
        return result_data
    else:
        output_img = PILImage.new("RGB", (width, height))
        output_img.putdata(result_data)
        return output_img

def apply_kernel(img, kernel):
    # Getting Img information
    width, height = img.size
    pixels = make2D(list(img.getdata()), width)
    #Preparing output structure
    out_img2 = PILImage.new("RGB", (width, height))
    out_img2_data = []
    

    # Iterating the mask over each pixel in the image
    for row in range(len(pixels)):
        out_img2_data.append([])
        for col in range(len(pixels[0])):
            r, g, b = (0, 0, 0)
            total_weight = 0
            # Going through the selected pixels and applying the mask
            for m_r in range(len(kernel)):
                for m_c in range(0,len(kernel[0])):
                    if (col - m_c < 0 or row - m_r < 0):
                        continue
                    if (col + m_c > len(pixels[0]) or row + m_r > len(pixels)):
                        continue
                    # Taking the weight sum and multiplying colors by their mask value
                    total_weight += kernel[m_r][m_c]
                    r += pixels[max(0, row - m_r)][min(len(pixels[0]), col - m_c)][0]*kernel[m_r][m_c]
                    g += pixels[max(0, row - m_r)][min(len(pixels[0]), col - m_c)][1]*kernel[m_r][m_c]
                    b += pixels[max(0, row - m_r)][min(len(pixels[0]), col - m_c)][2]*kernel[m_r][m_c]
            if(total_weight > -1 and total_weight < 1):
                out_img2_data[row].append((r, g, b))
            else:
                out_img2_data[row].append((r//total_weight, g//total_weight, b//total_weight))
    out_img2.putdata(flatten(out_img2_data))
    return out_img2


# API Routes

# Process image with specified operations
@app.route("/api/process-image", methods=["POST"])
def process_image():
    try:
        
        # Get uploaded file
        if 'image' not in request.files:
            print("Error: No image file provided")
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            print("Error: No selected file")
            return jsonify({'error': 'No selected file'}), 400

        # Generate a unique ID for this processing request
        unique_id = uuid.uuid4().hex
        temp_file = os.path.join(IMAGES_DIR, f"temp_image_{unique_id}.png")
        file.save(temp_file)

        # Get other parameters
        try:
            grid_size = int(request.form.get('grid_size', 3))
        except ValueError:
            print("Error: Invalid grid_size value")
            return jsonify({'error': 'Invalid grid_size value'}), 400

        try:
            rgb_values = json.loads(request.form.get('rgb_values', '{}'))
        except json.JSONDecodeError:
            print("Error: Invalid RGB values format")
            return jsonify({'error': 'Invalid RGB values format'}), 400

        try:
            kernel_values = json.loads(request.form.get('kernel_values', '[]'))
        except json.JSONDecodeError:
            print("Error: Invalid kernel values format")
            return jsonify({'error': 'Invalid kernel values format'}), 400

        # Check if RGB or kernel were modified
        rgb_modified = request.form.get('rgb_modified', 'false') == 'true'
        kernel_modified = request.form.get('kernel_modified', 'false') == 'true'
        if(rgb_modified == False and kernel_modified == False):
            print("Error: No changes made to image")
            return jsonify({'error': 'No changes made to image'}), 400

        # Process the image using the provided parameters
        try:
            processed_image = PILImage.open(temp_file).convert("RGB")
            
            # Apply color adjustments if RGB values were modified
            if rgb_modified:
                processed_image = set_color(processed_image, rgb_values['red'], "red")
                processed_image = set_color(processed_image, rgb_values['green'], "green")
                processed_image = set_color(processed_image, rgb_values['blue'], "blue")
            
            # Apply kernel if kernel was modified
            if kernel_modified:
                processed_image = apply_kernel(processed_image, kernel_values)
                
            # Convert to base64 for frontend
            buffered = BytesIO()
            processed_image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()

        except Exception as e:
            print(f"Error processing image: {str(e)}")
            return jsonify({"error": f"Error processing image: {str(e)}"}), 500

        # Clean up the temporary file
        os.remove(temp_file)

        return jsonify({
            "success": True,
            "image": f"data:image/png;base64,{img_str}",
            "grid_size": grid_size,
            "rgb_values": rgb_values,
            "kernel_values": kernel_values,
            "rgb_modified": rgb_modified,
            "kernel_modified": kernel_modified
        })

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)