from math import radians, sin, cos, sqrt, atan2

# ----------------------------
# Distance Calculation
# ----------------------------


def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = sin(dlat/2)**2 + cos(radians(lat1)) * \
        cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))

    return R * c


# ----------------------------
# Recommendation Engine
# ----------------------------

def generate_recommendations(user: dict, places: list, time_available: int = 6):

    interests = user.get("interests", [])
    user_type = user.get("user_type", "indian")

    scored_places = []

    # 1️⃣ Score all places
    for place in places:
        score = 0

        place_tags = place.get("tags", [])
        visit_duration = place.get("visit_duration_hours", 2)
        is_major = place.get("is_major_landmark", False)

        # Interest scoring
        for interest in interests:
            if interest in place_tags:
                score += 5

        # Tourist boost
        if user_type == "tourist" and is_major:
            score += 3

        # Time suitability
        if visit_duration <= time_available:
            score += 2

        if score > 0:
            scored_places.append((score, place))

    if not scored_places:
        return []

    # 2️⃣ Sort by score
    scored_places.sort(key=lambda x: x[0], reverse=True)

    # 3️⃣ Pick highest scored place as anchor
    anchor_place = scored_places[0][1]
    anchor_lat = anchor_place.get("latitude")
    anchor_lon = anchor_place.get("longitude")

    recommended = []
    total_time_used = 0
    max_distance_km = 3  # clustering radius

    # 4️⃣ Add nearby high scoring places
    for score, place in scored_places:
        lat = place.get("latitude")
        lon = place.get("longitude")
        visit_duration = place.get("visit_duration_hours", 2)

        if lat is None or lon is None:
            continue

        distance = calculate_distance(anchor_lat, anchor_lon, lat, lon)

        if distance <= max_distance_km:
            if total_time_used + visit_duration <= time_available:
                recommended.append(place)
                total_time_used += visit_duration

        if len(recommended) >= 5:
            break

    return recommended
