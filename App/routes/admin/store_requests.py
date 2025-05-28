from flask import jsonify, request
from . import admin_bp
from application.extensions import db
from DataBase.models import StoreCreationRequest, User, StoreCreationRequestStatus # Import StoreCreationRequestStatus
from utils.decorators import admin_required
from flask_login import current_user # Import current_user
from datetime import datetime # Import datetime

@admin_bp.route('/store-requests', methods=['GET'])
@admin_required
def list_store_requests():
    """Lists store creation requests, optionally filtered by status."""
    status_filter = request.args.get('status')
    
    # Base query, ordered by creation date descending
    query = StoreCreationRequest.query.order_by(StoreCreationRequest.created_at.desc())
    
    if status_filter:
        # Ensure the status filter is a valid one if necessary, or let DB handle it
        query = query.filter_by(status=status_filter)
    
    requests_list = query.all()
    
    output = []
    for req in requests_list:
        requester_info = None
        if req.requester: # Check if the requester relationship is loaded
            requester_info = {
                "id": req.requester.id, 
                "username": req.requester.username, 
                "email": req.requester.email
            }
        
        reviewer_info = None
        if req.reviewer: # Check if the reviewer relationship is loaded
            reviewer_info = {
                "id": req.reviewer.id, 
                "username": req.reviewer.username
            }
            
        output.append({
            "id": req.id,
            "user_id": req.user_id,
            "requester": requester_info,
            "status": req.status,
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "reviewed_at": req.reviewed_at.isoformat() if req.reviewed_at else None,
            "admin_reviewer_id": req.admin_reviewer_id,
            "reviewer": reviewer_info
        })
        
    return jsonify(output), 200


@admin_bp.route('/store-requests/<int:request_id>/approve', methods=['POST'])
@admin_required
def approve_store_request(request_id):
    """Approves a store creation request."""
    try:
        store_request = StoreCreationRequest.query.get(request_id)
        if not store_request:
            return jsonify({"error": "Store creation request not found."}), 404

        if store_request.status != StoreCreationRequestStatus.PENDING:
            return jsonify({"error": "Request has already been reviewed."}), 400

        user = User.query.get(store_request.user_id)
        if not user:
            # This case should ideally not happen if database integrity is maintained
            return jsonify({"error": "Requesting user not found."}), 404

        store_request.status = StoreCreationRequestStatus.APPROVED
        store_request.reviewed_at = datetime.utcnow()
        store_request.admin_reviewer_id = current_user.id
        
        user.can_create_store = True
        
        db.session.commit()
        
        return jsonify({"message": "Store creation request approved successfully."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error approving store request {request_id}: {str(e)}")
        return jsonify({"error": "An internal error occurred while approving the request."}), 500


@admin_bp.route('/store-requests/<int:request_id>/reject', methods=['POST'])
@admin_required
def reject_store_request(request_id):
    """Rejects a store creation request."""
    try:
        store_request = StoreCreationRequest.query.get(request_id)
        if not store_request:
            return jsonify({"error": "Store creation request not found."}), 404

        if store_request.status != StoreCreationRequestStatus.PENDING:
            return jsonify({"error": "Request has already been reviewed."}), 400

        store_request.status = StoreCreationRequestStatus.REJECTED
        store_request.reviewed_at = datetime.utcnow()
        store_request.admin_reviewer_id = current_user.id
        
        # Optional: Explicitly set user.can_create_store = False if needed.
        # For this implementation, we only update the request.
        # If a user was previously approved and then rejected on a new request,
        # this wouldn't revoke their 'can_create_store' status from the previous approval.
        # Business logic might require user.can_create_store = False here.

        db.session.commit()
        
        return jsonify({"message": "Store creation request rejected successfully."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error rejecting store request {request_id}: {str(e)}")
        return jsonify({"error": "An internal error occurred while rejecting the request."}), 500
